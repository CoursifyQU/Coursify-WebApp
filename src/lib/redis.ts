import { Redis } from "@upstash/redis"

let _redis: Redis | null = null

function getRedis(): Redis {
  if (_redis) return _redis
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN")
  }
  _redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  return _redis
}

export const redis = {
  get: <T = unknown>(...args: Parameters<Redis["get"]>) => getRedis().get<T>(...args),
  set: (...args: Parameters<Redis["set"]>) => getRedis().set(...args),
  del: (...args: Parameters<Redis["del"]>) => getRedis().del(...args),
}
