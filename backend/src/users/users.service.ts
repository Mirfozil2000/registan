import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../enums/user-role.enum';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOne(email: string): Promise<Pick<User, 'id' | 'email' | 'password' | 'role' | 'createdAt' | 'updatedAt'> | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, 
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }
  async create(data: {
    email: string;
    password: string;
    role?: UserRole
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        role: data.role || UserRole.STUDENT,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }
}