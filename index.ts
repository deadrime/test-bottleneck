import Bottleneck from 'bottleneck';
import * as Redis from 'redis';

const REDIS_URL = "redis://localhost:6379";

const redisClient = Redis.createClient({
  url: REDIS_URL,
})

const test = async () => {
  await redisClient.connect();

  await redisClient.set('test', 'redis is working');
  const value = await redisClient.get('test');
  console.log({ value });

  const connection = new Bottleneck.RedisConnection({
    client: redisClient,
  });

  const bottleneck = new Bottleneck({
    maxConcurrent: 1,
    connection: connection,
    // datastore: 'redis',
    // clientOptions: {
    //   url: REDIS_URL,
    // },
    // Redis,
  });

  console.log('schedule start')
  await bottleneck.schedule(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('job done');
        resolve('resolved');
      }, 1000);
    })
  })
  console.log('schedule end')
}

test();
