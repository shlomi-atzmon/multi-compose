const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // auto connect if lose connection once every 1 sec
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

// Purposefully using a recursive solution, it's very slow for a
// better reason of having worker process to calculate these Fibonacci values.
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  // Store in hash set with the key 'values'
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');
