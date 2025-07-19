# Backend Monorepo - Teljes Struktúra és Setup Guide

## 📁 Projekt Struktúra

```
backend-project/
├── .gitignore
├── .dockerignore
├── README.md
├── package.json                    # Root workspace config
├── pnpm-workspace.yaml
├── docker-compose.dev.yml          # Development adatbázisok
├── docker-compose.prod.yml         # Production teljes alkalmazás
├── Dockerfile.rest-api
├── Dockerfile.ws-api
├── 
├── packages/
│   ├── shared/                     # Közös kód
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .eslintrc.js
│   │   └── src/
│   │       ├── index.ts
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── utils/
│   │           └── index.ts
│   │
│   └── database/                   # Prisma config
│       ├── package.json
│       ├── .env.example
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       └── src/
│           └── client.ts
│
├── services/
│   ├── rest-api/                   # REST API microservice
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .eslintrc.js
│   │   ├── .env.example
│   │   ├── nodemon.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── app.ts
│   │       ├── routes/
│   │       │   └── index.ts
│   │       ├── controllers/
│   │       │   └── index.ts
│   │       ├── middleware/
│   │       │   └── index.ts
│   │       └── config/
│   │           └── index.ts
│   │
│   └── ws-api/                     # WebSocket API microservice
│       ├── package.json
│       ├── tsconfig.json
│       ├── .eslintrc.js
│       ├── .env.example
│       ├── nodemon.json
│       └── src/
│           ├── index.ts
│           ├── server.ts
│           ├── handlers/
│           │   └── index.ts
│           ├── middleware/
│           │   └── index.ts
│           └── config/
│               └── index.ts
```

## 🚀 Teljes Setup Guide

### 1. Projekt inicializálás

```bash
# Projekt mappa létrehozása
mkdir backend-project
cd backend-project

# pnpm workspace inicializálás
pnpm init
```

### 2. Root package.json létrehozása

```json
{
  "name": "backend-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"pnpm --filter rest-api dev\" \"pnpm --filter ws-api dev\"",
    "dev:rest": "pnpm --filter rest-api dev",
    "dev:ws": "pnpm --filter ws-api dev",
    "build": "pnpm --filter shared build && pnpm --filter database build && pnpm --filter rest-api build && pnpm --filter ws-api build",
    "build:rest": "pnpm --filter shared build && pnpm --filter database build && pnpm --filter rest-api build",
    "build:ws": "pnpm --filter shared build && pnpm --filter database build && pnpm --filter ws-api build",
    "start": "concurrently \"pnpm --filter rest-api start\" \"pnpm --filter ws-api start\"",
    "start:rest": "pnpm --filter rest-api start",
    "start:ws": "pnpm --filter ws-api start",
    "lint": "pnpm --filter \"*\" lint",
    "lint:fix": "pnpm --filter \"*\" lint:fix",
    "db:generate": "pnpm --filter database db:generate",
    "db:push": "pnpm --filter database db:push",
    "db:migrate": "pnpm --filter database db:migrate",
    "db:studio": "pnpm --filter database db:studio",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up -d",
    "docker:dev:down": "docker-compose -f docker-compose.dev.yml down",
    "docker:build": "docker-compose -f docker-compose.prod.yml build",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up -d",
    "docker:prod:down": "docker-compose -f docker-compose.prod.yml down"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### 3. pnpm-workspace.yaml létrehozása

```yaml
packages:
  - 'packages/*'
  - 'services/*'
```

### 4. Shared package létrehozása

```bash
mkdir -p packages/shared/src/{types,utils}
cd packages/shared
```

**packages/shared/package.json:**
```json
{
  "name": "@backend/shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^17.1.0",
    "eslint-plugin-import": "^2.27.5",
    "typescript": "^5.1.6"
  }
}
```

**packages/shared/tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**packages/shared/.eslintrc.js:**
```javascript
module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
```

**packages/shared/src/index.ts:**
```typescript
export * from './types';
export * from './utils';
```

**packages/shared/src/types/index.ts:**
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  userId?: string;
  timestamp: Date;
}
```

**packages/shared/src/utils/index.ts:**
```typescript
export const formatResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string,
): ApiResponse<T> => ({
  success,
  data,
  message,
  error,
});

export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

### 5. Database package létrehozása

```bash
mkdir -p packages/database/{src,prisma}
cd packages/database
```

**packages/database/package.json:**
```json
{
  "name": "@backend/database",
  "version": "1.0.0",
  "main": "dist/client.js",
  "types": "dist/client.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.1.1",
    "ioredis": "^5.3.2"
  },
  "devDependencies": {
    "prisma": "^5.1.1",
    "tsx": "^3.12.7",
    "typescript": "^5.1.6"
  }
}
```

**packages/database/prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

**packages/database/src/client.ts:**
```typescript
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

export * from '@prisma/client';
```

**packages/database/.env.example:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/backend_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 6. REST API service létrehozása

```bash
mkdir -p services/rest-api/src/{routes,controllers,middleware,config}
cd services/rest-api
```

**services/rest-api/package.json:**
```json
{
  "name": "@backend/rest-api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  },
  "dependencies": {
    "@backend/shared": "workspace:*",
    "@backend/database": "workspace:*",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^6.8.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/morgan": "^1.9.4",
    "@types/node": "^20.4.5",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^17.1.0",
    "eslint-plugin-import": "^2.27.5",
    "nodemon": "^3.0.1",
    "typescript": "^5.1.6"
  }
}
```

**services/rest-api/src/index.ts:**
```typescript
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 REST API server running on port ${PORT}`);
});
```

**services/rest-api/src/app.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'rest-api' });
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

export default app;
```

**services/rest-api/src/routes/index.ts:**
```typescript
import { Router } from 'express';
import { getUsersController } from '../controllers';

const router = Router();

router.get('/users', getUsersController);

export default router;
```

**services/rest-api/src/controllers/index.ts:**
```typescript
import { Request, Response } from 'express';
import { prisma } from '@backend/database';
import { formatResponse, asyncHandler } from '@backend/shared';

export const getUsersController = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(formatResponse(true, users, 'Users fetched successfully'));
});
```

**services/rest-api/.env.example:**
```env
NODE_ENV=development
PORT=8080
DATABASE_URL="postgresql://user:password@localhost:5432/backend_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 7. WebSocket API service létrehozása

```bash
mkdir -p services/ws-api/src/{handlers,middleware,config}
cd services/ws-api
```

**services/ws-api/package.json:**
```json
{
  "name": "@backend/ws-api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  },
  "dependencies": {
    "@backend/shared": "workspace:*",
    "@backend/database": "workspace:*",
    "socket.io": "^4.7.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.4.5",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^17.1.0",
    "eslint-plugin-import": "^2.27.5",
    "nodemon": "^3.0.1",
    "typescript": "^5.1.6"
  }
}
```

**services/ws-api/src/index.ts:**
```typescript
import dotenv from 'dotenv';
import { createServer } from './server';

dotenv.config();

const PORT = process.env.PORT || 8081;

const server = createServer();

server.listen(PORT, () => {
  console.log(`🚀 WebSocket API server running on port ${PORT}`);
});
```

**services/ws-api/src/server.ts:**
```typescript
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { setupSocketHandlers } from './handlers';

export const createServer = () => {
  const httpServer = createServer();
  
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  setupSocketHandlers(io);

  // Health check endpoint
  httpServer.on('request', (req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'OK', service: 'ws-api' }));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  return httpServer;
};
```

**services/ws-api/src/handlers/index.ts:**
```typescript
import { Server as SocketServer, Socket } from 'socket.io';
import { prisma, redis } from '@backend/database';
import { WebSocketMessage } from '@backend/shared';

export const setupSocketHandlers = (io: SocketServer) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join-room', (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('message', async (data: WebSocketMessage) => {
      console.log('Received message:', data);
      
      // Store message in Redis
      await redis.lpush(`messages:${data.type}`, JSON.stringify({
        ...data,
        timestamp: new Date(),
        socketId: socket.id,
      }));

      // Broadcast to all clients
      io.emit('message', {
        ...data,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
```

**services/ws-api/.env.example:**
```env
NODE_ENV=development
PORT=8081
DATABASE_URL="postgresql://user:password@localhost:5432/backend_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 8. Docker konfigurációk

**docker-compose.dev.yml** (Development adatbázisok):
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: backend_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

**Dockerfile.rest-api:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/ ./packages/shared/
COPY packages/database/ ./packages/database/
COPY services/rest-api/ ./services/rest-api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages
RUN pnpm --filter shared build
RUN pnpm --filter database build

# Generate Prisma client
RUN pnpm --filter database db:generate

# Build rest-api
RUN pnpm --filter rest-api build

EXPOSE 8080

CMD ["pnpm", "--filter", "rest-api", "start"]
```

**Dockerfile.ws-api:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/ ./packages/shared/
COPY packages/database/ ./packages/database/
COPY services/ws-api/ ./services/ws-api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages
RUN pnpm --filter shared build
RUN pnpm --filter database build

# Generate Prisma client
RUN pnpm --filter database db:generate

# Build ws-api
RUN pnpm --filter ws-api build

EXPOSE 8081

CMD ["pnpm", "--filter", "ws-api", "start"]
```

**docker-compose.prod.yml** (Teljes alkalmazás):
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: backend_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - backend-network

  rest-api:
    build:
      context: .
      dockerfile: Dockerfile.rest-api
    ports:
      - "8080:8080"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:password@postgres:5432/backend_db?schema=public
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - postgres
      - redis
    networks:
      - backend-network

  ws-api:
    build:
      context: .
      dockerfile: Dockerfile.ws-api
    ports:
      - "8081:8081"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:password@postgres:5432/backend_db?schema=public
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - postgres
      - redis
    networks:
      - backend-network

volumes:
  postgres_data:
  redis_data:

networks:
  backend-network:
    driver: bridge
```

### 9. Egyéb konfig fájlok

**.gitignore:**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
/dist/
/build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Prisma
packages/database/prisma/migrations/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

**.dockerignore:**
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.DS_Store
```

## 🎯 Használat

### Development mód:

```bash
# Adatbázisok indítása
pnpm docker:dev

# Függőségek telepítése
pnpm install

# Prisma generálása
pnpm db:generate

# Adatbázis migrációk futtatása
pnpm db:push

# Mindkét service indítása
pnpm dev

# Vagy külön-külön:
pnpm dev:rest    # REST API csak
pnpm dev:ws      # WebSocket API csak
```

### Production build:

```bash
# Helyi build
pnpm build

# Docker build és indítás
pnpm docker:build
pnpm docker:prod
```

### Hasznos parancsok:

```bash
# Linting
pnpm lint
pnpm lint:fix

# Prisma
pnpm db:studio    # Adatbázis GUI
pnpm db:migrate   # Migrációk

# Docker
pnpm docker:dev:down    # Dev adatbázisok leállítása
pnpm docker:prod:down   # Prod alkalmazás leállítása
```

## 📋 Ellenőrzési lista

- ✅ pnpm workspace monorepo
- ✅ Közös Prisma konfiguráció
- ✅ Shared package közös kódnak
- ✅ TypeScript + ESLint Airbnb
- ✅ Express REST API (port 8080)
- ✅ Socket.io WebSocket API (port 8081)
- ✅ PostgreSQL + Redis támogatás
- ✅ Külön .env fájlok
- ✅ Docker development és production
- ✅ Egyszerű build és dev parancsok

## 🚀 Első lépések

1. Klónold/hozd létre a projektet
2. `pnpm install`
3. `cp packages/database/.env.example packages/database/.env`
4. `cp services/rest-api/.env.example services/rest-api/.env`
5. `cp services/ws-api/.env.example services/ws-api/.env`
6. `pnpm docker:dev`
7. `pnpm db:generate && pnpm db:push`
8. `pnpm dev`

Az alkalmazás készen áll! A REST API a `http://localhost:8080`-on, a WebSocket API a `http://localhost:8081`-en érhető el.