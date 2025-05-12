import { Configuration, OpenAIApi } from 'openai-edge';
import { UserInput, ProjectIdea } from '@/types';
import { NextResponse } from 'next/server';

// Debug: Log environment variable presence
console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Debug: Log incoming request
    console.log('Received request body:', await req.clone().json());
    
    const { name, interests, skills, gradeLevel, location } = (await req.json()) as UserInput;

    const prompt = `Generate 3 project ideas for a ${gradeLevel} student named ${name} who is interested in ${interests.join(
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

    // Debug: Log prompt being sent to OpenAI
    console.log('Sending prompt to OpenAI:', prompt);

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful academic advisor who specializes in suggesting extracurricular projects to students.',
          },
          { role: 'user', content: prompt },
        ],
      });

      // Debug: Log raw OpenAI response
      const rawResponse = await response.json();
      console.log('Raw OpenAI response:', rawResponse);

      const content = rawResponse.choices?.[0]?.message?.content;
      
      if (!content) {
        console.error('No content in OpenAI response:', rawResponse);
        throw new Error('No response from OpenAI');
      }

      // Debug: Log content before parsing
      console.log('Content before parsing:', content);

      try {
        const projects = JSON.parse(content);
        // Debug: Log parsed projects
        console.log('Successfully parsed projects:', projects);
        return NextResponse.json(projects);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        console.error('Parse error:', parseError);
        throw new Error('Invalid response format from OpenAI');
      }
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      throw new Error(`OpenAI API error: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in projects API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate projects' },
      { status: 500 }
    );
  }
}
