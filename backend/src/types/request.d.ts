import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
    changePassword?: boolean;
  };
}