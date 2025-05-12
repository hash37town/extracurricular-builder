import { nanoid } from 'nanoid';
import Redis from 'ioredis';
import { WebScrapedData, WebScrapedDataSchema } from './types';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

// Create a new Redis connection for each operation
function createClient(): Redis {
  const redis = new Redis(process.env.REDIS_URL!);
  
  // Add logging
  redis.on('connect', () => console.log(`[REDIS] ${new Date().toISOString()} Connected`));
  redis.on('ready', () => console.log(`[REDIS] ${new Date().toISOString()} Ready`));
  redis.on('error', (err) => console.error(`[REDIS] ${new Date().toISOString()} Error:`, err));
  redis.on('close', () => console.log(`[REDIS] ${new Date().toISOString()} Connection closed`));
  redis.on('end', () => console.log(`[REDIS] ${new Date().toISOString()} Connection ended`));

  // Log all commands
  redis.on('monitor', (time, args, source) => {
    console.log(`[REDIS] ${new Date().toISOString()} Command: ${args.join(' ')} from ${source}`);
  });

  // Enable monitor mode
  redis.monitor((err, monitor) => {
    if (err) {
      console.error(`[REDIS] ${new Date().toISOString()} Monitor error:`, err);
    }
  });

  return redis;
}

export async function removeAllData(): Promise<void> {
  const redis = createClient();
  try {
    const keys = await redis.keys('scrape:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } finally {
    await redis.quit();
  }
}

export async function storeScrapedData(data: StorageInput): Promise<string> {
  const redis = createClient();
  try {
    const id = nanoid();
    const fullData: WebScrapedData = {
      ...data,
      id,
      timestamp: Date.now(),
    };

    const multi = redis.multi();
    multi.set(`scrape:data:${id}`, JSON.stringify(fullData));
    multi.sadd('scrape:categories', data.category);
    multi.sadd(`scrape:category:${data.category}`, id);
    
    if (data.labels.length > 0) {
      multi.sadd('scrape:labels', ...data.labels);
      data.labels.forEach(label => {
        multi.sadd(`scrape:label:${label}`, id);
      });
    }

    await multi.exec();
    return id;
  } finally {
    await redis.quit();
  }
}

export async function getDataByCategory(category: string): Promise<WebScrapedData[]> {
  const redis = createClient();
  try {
    const ids = await redis.smembers(`scrape:category:${category}`);
    if (ids.length === 0) return [];

    const multi = redis.multi();
    ids.forEach(id => {
      multi.get(`scrape:data:${id}`);
    });

    const results = await multi.exec();
    if (!results) return [];

    return results
      .map(([err, data]) => {
        if (err || !data) return null;
        try {
          return WebScrapedDataSchema.parse(JSON.parse(data as string));
        } catch {
          return null;
        }
      })
      .filter((data): data is WebScrapedData => data !== null);
  } finally {
    await redis.quit();
  }
}

export async function deleteScrapedData(id: string): Promise<boolean> {
  const redis = createClient();
  try {
    const data = await redis.get(`scrape:data:${id}`);
    if (!data) return false;

    const parsedData = WebScrapedDataSchema.parse(JSON.parse(data));
    const multi = redis.multi();

    multi.del(`scrape:data:${id}`);
    multi.srem(`scrape:category:${parsedData.category}`, id);
    parsedData.labels.forEach(label => {
      multi.srem(`scrape:label:${label}`, id);
    });

    await multi.exec();

    // Cleanup empty sets
    const cleanupMulti = redis.multi();
    const categoryMembers = await redis.scard(`scrape:category:${parsedData.category}`);
    if (categoryMembers === 0) {
      cleanupMulti.del(`scrape:category:${parsedData.category}`);
      cleanupMulti.srem('scrape:categories', parsedData.category);
    }

    for (const label of parsedData.labels) {
      const labelMembers = await redis.scard(`scrape:label:${label}`);
      if (labelMembers === 0) {
        cleanupMulti.del(`scrape:label:${label}`);
        cleanupMulti.srem('scrape:labels', label);
      }
    }

    await cleanupMulti.exec();
    return true;
  } finally {
    await redis.quit();
  }
}

type StorageInput = Omit<WebScrapedData, 'id' | 'timestamp'>;
