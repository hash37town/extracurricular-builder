import { NextResponse } from 'next/server';
import { findOpportunities } from '@/lib/scraper';
import type { UserInput } from '@/types';

export async function POST(request: Request) {
  try {
    const input: UserInput = await request.json();
    const opportunities = await findOpportunities(input);
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error in opportunities API:', error);
    return NextResponse.json(
      { error: 'Failed to find opportunities' },
      { status: 500 }
    );
  }
}
