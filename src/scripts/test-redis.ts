import 'dotenv/config';
import Redis from 'ioredis';
import { WebScrapedData } from '../lib/redis/types';

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
    console.log(`[REDIS TEST] ${new Date().toISOString()} Command: ${args.join(' ')} from ${source}`);
  });

  // Enable monitor mode
  redis.monitor((err, monitor) => {
    if (err) {
      console.error(`[REDIS TEST] ${new Date().toISOString()} Monitor error:`, err);
    }
  });

  return redis;
}

let requestsSent = 0;
let requestsConfirmed = 0;

async function getStats() {
  const redis = createClient();
  try {
    requestsSent++;
    const info = await redis.info();
    requestsConfirmed++;

    const stats = {
      commands: 0,
      hits: 0,
      misses: 0,
      memory: 0,
      bandwidth: 0,
      connections: 0
    };

    info.split('\n').forEach(line => {
      if (line.startsWith('total_commands_processed:')) {
        stats.commands = parseInt(line.split(':')[1], 10);
      }
      if (line.startsWith('keyspace_hits:')) {
        stats.hits = parseInt(line.split(':')[1], 10);
      }
      if (line.startsWith('keyspace_misses:')) {
        stats.misses = parseInt(line.split(':')[1], 10);
      }
      if (line.startsWith('used_memory:')) {
        stats.memory = parseInt(line.split(':')[1], 10);
      }
      if (line.startsWith('total_net_input_bytes:')) {
        stats.bandwidth = parseInt(line.split(':')[1], 10);
      }
      if (line.startsWith('connected_clients:')) {
        stats.connections = parseInt(line.split(':')[1], 10);
      }
    });

    return stats;
  } finally {
    await redis.quit();
  }
}

async function ensureKeyspaceEmpty(): Promise<void> {
  const redis = createClient();
  try {
    // Get all keyspaces
    requestsSent++;
    const keyspaces = await redis.info('keyspace');
    requestsConfirmed++;

    if (keyspaces.includes('keys=')) {
      // Check both generic and scrape-specific keys
      requestsSent += 2;
      const [allKeys, scrapeKeys] = await Promise.all([
        redis.keys('*'),
        redis.keys('scrape:*')
      ]);
      requestsConfirmed += 2;
      
      const keys = Array.from(new Set([...allKeys, ...scrapeKeys]));
      if (keys.length > 0) {
        requestsSent++;
        await redis.del(...keys);
        requestsConfirmed++;
      }

      // Verify deletion
      requestsSent += 2;
      const [remainingKeys, remainingScrapeKeys] = await Promise.all([
        redis.keys('*'),
        redis.keys('scrape:*')
      ]);
      requestsConfirmed += 2;

      if (remainingKeys.length > 0 || remainingScrapeKeys.length > 0) {
        throw new Error(`Failed to clean keyspace. ${remainingKeys.length + remainingScrapeKeys.length} keys remain`);
      }
    }
  } finally {
    await redis.quit();
  }
}

async function testRedisStorage() {
  try {
    // Ensure clean start
    console.log('\nCleaning keyspace...');
    await ensureKeyspaceEmpty();

    // Get initial stats
    console.log('Getting initial stats...');
    const startStats = await getStats();
    console.log('Initial connections:', startStats.connections);

    // Write test data (6KB total)
    console.log('Writing test data...');
    const itemSize = 2048; // 2KB
    const content = 'x'.repeat(itemSize);

    const redis = createClient();
    try {
      // Prepare all writes in one transaction
      const multi = redis.multi();
      for (let i = 0; i < 3; i++) {
        const id = `test${i}`;
        const data: WebScrapedData = {
          id,
          url: `https://test${i}.example.com`,
          title: `t${i}`,
          content,
          category: 'test',
          labels: ['test'],
          timestamp: Date.now(),
          metadata: { size: itemSize }
        };

        multi.set(`scrape:data:${id}`, JSON.stringify(data));
        multi.sadd('scrape:categories', 'test');
        multi.sadd('scrape:category:test', id);
        multi.sadd('scrape:labels', 'test');
        multi.sadd('scrape:label:test', id);
      }

      // Execute writes with retry
      requestsSent++;
      await multi.exec();
      requestsConfirmed++;

      // Prepare all deletes in one transaction
      console.log('Cleaning up test data...');
      const deleteMulti = redis.multi();
      for (let i = 0; i < 3; i++) {
        const id = `test${i}`;
        deleteMulti.del(`scrape:data:${id}`);
        deleteMulti.srem('scrape:category:test', id);
        deleteMulti.srem('scrape:label:test', id);
      }
      deleteMulti.del('scrape:categories', 'scrape:labels');
      deleteMulti.del('scrape:category:test', 'scrape:label:test');

      // Execute deletes with retry
      requestsSent++;
      await deleteMulti.exec();
      requestsConfirmed++;
    } finally {
      await redis.quit();
    }

    // Verify keyspace is empty
    console.log('Verifying cleanup...');
    await ensureKeyspaceEmpty();

    // Get final stats
    console.log('Getting final stats...');
    const endStats = await getStats();
    console.log('Final connections:', endStats.connections);

    // Print results
    console.log('\nTest Results:');
    console.log(`Requests sent: ${requestsSent}`);
    console.log(`Requests confirmed: ${requestsConfirmed}`);
    console.log(`Redis commands: ${endStats.commands - startStats.commands}`);
    console.log(`Cache hits: ${endStats.hits - startStats.hits}`);
    console.log(`Cache misses: ${endStats.misses - startStats.misses}`);
    console.log(`Memory change: ${endStats.memory - startStats.memory} bytes`);
    console.log(`Bandwidth used: ${endStats.bandwidth - startStats.bandwidth} bytes`);

    // Clean exit
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Start test and ensure process exits
testRedisStorage().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
