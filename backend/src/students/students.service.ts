import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async getAllStudents() {
    return this.prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });
  }
  async createStudent(dto: CreateStudentDto) {
    const baseEmail = dto.fullName.toLowerCase().replace(/\s+/g, '.') + '@school.com';
    const user = await this.prisma.user.create({
      data: {
        email: baseEmail,
        password: await bcrypt.hash('TempPassword123!', 10),
        role: UserRole.STUDENT
      }
    });
    return this.prisma.student.create({
      data: {
        fullName: dto.fullName,
        birthDate: dto.birthDate,
        class: dto.class,
        address: dto.address,
        phone: dto.phone,
        userId: user.id
      },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });
  }
}