import { UserInput, ProjectIdea } from '@/types';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Rate limiting configuration
const MINUTE_LIMIT = 3;
const DAILY_LIMIT = 200;
const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

// In-memory rate limiting (note: this resets on server restart)
let minuteRequests: number[] = [];
let dailyRequests: number[] = [];

function isRateLimited(): { limited: boolean; resetIn?: number } {
  const now = Date.now();
  
  // Clean up old timestamps
  minuteRequests = minuteRequests.filter(time => now - time < MINUTE_MS);
  dailyRequests = dailyRequests.filter(time => now - time < DAY_MS);

  // Check minute limit
  if (minuteRequests.length >= MINUTE_LIMIT) {
    const oldestMinute = minuteRequests[0];
    return { limited: true, resetIn: MINUTE_MS - (now - oldestMinute) };
  }

  // Check daily limit
  if (dailyRequests.length >= DAILY_LIMIT) {
    const oldestDay = dailyRequests[0];
    return { limited: true, resetIn: DAY_MS - (now - oldestDay) };
  }

  return { limited: false };
}

function recordRequest() {
  const now = Date.now();
  minuteRequests.push(now);
  dailyRequests.push(now);
}

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function makeOpenAIRequest(messages: any[], retryCount = 0): Promise<any> {
  try {
    // Check rate limits
    const rateLimitStatus = isRateLimited();
    if (rateLimitStatus.limited) {
      const resetInSeconds = Math.ceil((rateLimitStatus.resetIn || 0) / 1000);
      throw new Error(`Rate limit exceeded. Please try again in ${resetInSeconds} seconds.`);
    }

    // Record this request
    recordRequest();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    // If we get a 429, wait and retry
    if (response.status === 429 && retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
      console.log(`OpenAI rate limited. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeOpenAIRequest(messages, retryCount + 1);
    }

    const responseText = await response.text();
    console.log('API response status:', response.status);
    console.log('API response text:', responseText);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse API response:', responseText);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    // Only retry on network errors or OpenAI rate limits, not our own rate limits
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (retryCount < MAX_RETRIES && errorMessage.includes('OpenAI rate limited')) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Request failed. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeOpenAIRequest(messages, retryCount + 1);
    }
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { name, interests, skills, gradeLevel, location } = (await req.json()) as UserInput;

    const systemPrompt = 'You are a helpful academic advisor who specializes in suggesting extracurricular projects to students. Always respond with valid JSON arrays containing exactly 3 project ideas.';
    
    const userPrompt = `Generate 3 project ideas for a ${gradeLevel} student named ${name} who is interested in ${interests.join(
      ', '
    )} and has skills in ${skills.join(', ')}. They are located in ${location}.

Each project should be challenging but achievable, helping them develop their skills and interests.

Format each project as a JSON object with these fields:
- title: A concise, descriptive title
- description: A clear explanation of the project
- skills: Array of skills they'll develop
- impact: The potential impact or outcome
- timeline: Estimated time to complete

Respond only with the JSON array of 3 project ideas.`;

    try {
      console.log('Making API request...');
      
      const data = await makeOpenAIRequest([
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ]);

      console.log('Parsed API response:', data);

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.error('No content in response:', data);
        throw new Error('No content in API response');
      }

      try {
        const projects = typeof content === 'string' ? JSON.parse(content) : content;
        
        if (!Array.isArray(projects) || projects.length !== 3) {
          console.error('Invalid projects format:', projects);
          throw new Error('Invalid response format - expected array of 3 projects');
        }

        const requiredFields = ['title', 'description', 'skills', 'impact', 'timeline'];
        projects.forEach((project, index) => {
          requiredFields.forEach(field => {
            if (!project[field]) {
              throw new Error(`Project ${index + 1} missing required field: ${field}`);
            }
          });
        });

        return NextResponse.json(projects);
      } catch (parseError) {
        console.error('Failed to parse or validate content:', content);
        throw new Error('Invalid project format in response');
      }
    } catch (apiError) {
      console.error('API request error:', apiError);
      throw new Error(apiError instanceof Error ? apiError.message : 'Failed to generate projects');
    }
  } catch (error) {
    console.error('Request handler error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate projects' },
      { status: 500 }
    );
  }
}
