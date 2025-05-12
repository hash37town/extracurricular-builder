import Redis from 'ioredis';
import { WebScrapedData } from './types';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

// Create a new Redis connection for each operation
function createClient(): Redis {
  const redis = new Redis(process.env.REDIS_URL!, {
    retryStrategy: (times) => {
      // Maximum retry time is 3 seconds
      return Math.min(times * 50, 3000);
    },
  });

  // Log all commands
  redis.on('monitor', (time, args, source) => {
    console.log(`[REDIS DEBUG] ${new Date().toISOString()} Command: ${args.join(' ')} from ${source}`);
  });

  // Enable monitor mode
  redis.monitor((err, monitor) => {
    if (err) {
      console.error(`[REDIS DEBUG] ${new Date().toISOString()} Monitor error:`, err);
    }
  });

  return redis;
}

export async function getRedisStats() {
  const redis = createClient();
  try {
    const info = await redis.info();
    return {
      info,
      status: 'connected',
    };
  } catch (error) {
    console.error('Redis stats error:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error',
    };
  } finally {
    await redis.quit();
  }
}

export async function getAllKeys(pattern: string = '*'): Promise<string[]> {
  const redis = createClient();
  try {
    return await redis.keys(pattern);
  } catch (error) {
    console.error('Redis keys error:', error);
    return [];
  } finally {
    await redis.quit();
  }
}

export async function dumpAllData(): Promise<{
  categories: string[];
  labels: string[];
  data: WebScrapedData[];
  keys: string[];
  stats: any;
}> {
  const redis = createClient();
  try {
    const [categories, labels, keys, stats] = await Promise.all([
      redis.smembers('scrape:categories'),
      redis.smembers('scrape:labels'),
      getAllKeys('scrape:*'),
      getRedisStats(),
    ]);

    const dataKeys = keys.filter(key => key.startsWith('scrape:data:'));
    const dataPromises = dataKeys.map(async key => {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    });

    const data = (await Promise.all(dataPromises)).filter(Boolean);

    return {
      categories,
      labels,
      data,
      keys,
      stats,
    };
  } catch (error) {
    console.error('Redis dump error:', error);
    throw error;
  } finally {
    await redis.quit();
  }
}

export async function clearAllData(): Promise<boolean> {
  const redis = createClient();
  try {
    const keys = await getAllKeys('scrape:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Redis clear error:', error);
    return false;
  } finally {
    await redis.quit();
  }
}
