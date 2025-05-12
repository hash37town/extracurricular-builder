import { Configuration, OpenAIApi } from 'openai-edge';
import { NextResponse } from 'next/server';
import { EmailPrompt } from '@/types';

const config = new Configuration({
  apiKey: process.env.openai_api_key,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { opportunity, student } = (await req.json()) as EmailPrompt;

    const prompt = `Write a professional email to ${opportunity.organization} expressing interest in their ${opportunity.title} opportunity.
    
Student Information:
- Name: ${student.name}
- Grade: ${student.grade}
- Interests: ${student.interests.join(', ')}
- Skills: ${student.skills.join(', ')}

Make the email:
1. Professional and concise
2. Highlight relevant skills and interests
3. Show genuine enthusiasm
4. Ask about next steps
5. Include a polite closing

Email format:
Subject: Interest in ${opportunity.title}
Body: [Generate the email body]`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that writes professional emails for students.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: true,
    });

    const { choices } = await response.json();
    const emailContent = choices[0]?.message?.content;
    if (!emailContent) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ email: emailContent });
  } catch (error) {
    console.error('Error generating email:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}
