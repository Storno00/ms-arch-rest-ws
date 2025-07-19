import { Request, Response } from 'express';
import { prisma } from '@backend/database';
import { formatResponse, asyncHandler } from '@backend/shared';

export const getUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(formatResponse(true, users, 'Users fetched successfully'));
  }
);
