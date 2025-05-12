import { NextResponse } from 'next/server';
import { WebScrapedDataSchema } from '@/lib/redis/types';
import { storeScrapedData, getDataByCategory, getDataByLabel } from '@/lib/redis/storage';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = WebScrapedDataSchema.omit({ id: true }).parse(body);
    
    const id = await storeScrapedData(data);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error in scrape POST:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const label = searchParams.get('label');

    if (!category && !label) {
      return NextResponse.json(
        { success: false, error: 'Must provide category or label parameter' },
        { status: 400 }
      );
    }

    let data;
    if (category) {
      data = await getDataByCategory(category);
    } else if (label) {
      data = await getDataByLabel(label);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in scrape GET:', error);
    return NextResponse.json(
      { success: false, error: 'Error retrieving data' },
      { status: 500 }
    );
  }
}
