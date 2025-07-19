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