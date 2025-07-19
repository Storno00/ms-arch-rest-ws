import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
});

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

export * from '@prisma/client';
