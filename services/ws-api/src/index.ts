import dotenv from 'dotenv';
import { createServer } from './server';

dotenv.config();

const PORT = process.env.PORT || 8081;

const server = createServer();

server.listen(PORT, () => {
  console.log(`🚀 WebSocket API server running on port ${PORT}`);
});
