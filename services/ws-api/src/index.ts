import dotenv from 'dotenv';
import { bootstrap } from './server';

dotenv.config();

const PORT = process.env.PORT || 8081;

const server = bootstrap();

server.listen(PORT, () => {
  console.log(`🚀 WebSocket API server running on port ${PORT}`);
});
