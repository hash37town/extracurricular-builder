import { Configuration, OpenAIApi } from 'openai';
import { NextResponse } from 'next/server';
import { generateEmailPrompt } from '@/lib/openai';
import type { UserInput } from '@/types';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const { input, opportunity }: { input: UserInput; opportunity: string } =
      await request.json();

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates professional emails for high school students.",
        },
        {
          role: "user",
          content: generateEmailPrompt(input, opportunity),
        },
      ],
      temperature: 0.7,
    });

    const response = completion.data.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json(JSON.parse(response));
  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}
