import { NextResponse } from 'next/server';
import { dumpAllData, clearAllData, getRedisStats } from '@/lib/redis/debug';
import { storeScrapedData } from '@/lib/redis/storage';
import { WebScrapedData } from '@/lib/redis/types';

// Sample test data
const TEST_DATA: Omit<WebScrapedData, 'id' | 'timestamp'> = {
  url: 'https://example.com/test',
  title: 'Test Article',
  content: 'This is test content for Redis storage',
  category: 'test',
  labels: ['debug', 'test'],
  metadata: {
    source: 'debug-api',
  },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        return NextResponse.json(await getRedisStats());

      case 'dump':
        return NextResponse.json(await dumpAllData());

      case 'clear':
        return NextResponse.json({ success: await clearAllData() });

      case 'test':
        // Store test data
        const id = await storeScrapedData(TEST_DATA);
        
        // Verify storage by dumping data
        const dump = await dumpAllData();
        
        return NextResponse.json({
          success: true,
          testId: id,
          dump,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: status, dump, clear, or test' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Redis debug error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
