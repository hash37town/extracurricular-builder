import { Configuration, OpenAIApi } from 'openai';
import { NextResponse } from 'next/server';
import type { UserInput } from '@/types';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const input: UserInput = await request.json();

    const prompt = `Generate 3 project ideas based on the following:
- Grade level: ${input.gradeLevel}
- Location: ${input.location}
- Interests: ${input.interests.join(', ')}

For each project, include:
1. Title
2. Description (2-3 sentences)
3. Required skills (2-4 items)
4. Time commitment
5. Potential impact
6. Helpful resources (1-2 URLs with titles)

Format as a JSON array with objects containing:
{
  "title": "Project title",
  "description": "Project description",
  "requiredSkills": ["skill1", "skill2"],
  "timeCommitment": "Estimated time",
  "impact": "Description of impact",
  "resources": [{"url": "URL", "title": "Resource title"}]
}`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates project ideas.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
    });

    const response = completion.data.choices[0]?.message?.content || '';
    const projects = JSON.parse(response);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error generating projects:', error);
    return NextResponse.json(
      { error: 'Failed to generate project ideas. Please try again.' },
      { status: 500 }
    );
  }
}
