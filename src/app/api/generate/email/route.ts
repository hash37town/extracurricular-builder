import { Configuration, OpenAIApi } from 'openai-edge';
import { NextResponse } from 'next/server';
import { EmailPrompt } from '@/types';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { opportunity, userInput } = (await req.json()) as EmailPrompt;
    const { name, gradeLevel, location } = userInput;

    const prompt = `Write a professional email to express interest in the following opportunity:

Organization: ${opportunity.organization}
Title: ${opportunity.title}
Type: ${opportunity.type}
Description: ${opportunity.description}

The email should be from a ${gradeLevel} student named ${name} from ${location}.

Format the response as a JSON object with:
- subject: A clear, professional subject line
- body: The email body with proper formatting and structure

Respond only with the JSON object.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional email writer who helps students craft compelling emails for extracurricular opportunities.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const { choices } = await response.json();
    const content = choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error generating email', { status: 500 });
  }
}
