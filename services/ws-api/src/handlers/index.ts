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
      await redis.lpush(
        `messages:${data.type}`,
        JSON.stringify({
          ...data,
          timestamp: new Date(),
          socketId: socket.id,
        })
      );

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
