import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { setupSocketHandlers } from './handlers';

export const bootstrap = () => {
  const httpServer = createServer();

  const io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
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
