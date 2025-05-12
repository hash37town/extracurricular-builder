import { Configuration, OpenAIApi } from 'openai-edge';
import { NextResponse } from 'next/server';
import { generateProjectPrompt } from '@/lib/openai';
import type { UserInput } from '@/types';

const configuration = new Configuration({
  apiKey: process.env.openai_api_key,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const input: UserInput = await request.json();

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates project ideas for high school students.",
        },
        {
          role: "user",
          content: generateProjectPrompt(input),
        },
      ],
      temperature: 0.7,
    });

    const { choices } = await completion.json();
    const response = choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json(JSON.parse(response));
  } catch (error) {
    console.error('Error in projects API:', error);
    return NextResponse.json(
      { error: 'Failed to generate project ideas' },
      { status: 500 }
    );
  }
}
