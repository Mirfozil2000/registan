import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  private generateTemporaryPassword(length = 12): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
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
    // Генерация логина
    let baseEmail = dto.fullName.toLowerCase()
      .replace(/\s+/g, '.')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Удаляем акценты
      .replace(/[^a-z0-9.]/g, '') + '@school.com';

    // Проверка уникальности
    let counter = 1;
    let tempEmail = baseEmail;
    while (true) {
      const exists = await this.prisma.user.findUnique({
        where: { email: tempEmail }
      });
      if (!exists) break;
      tempEmail = `${baseEmail.split('@')[0]}${counter}@school.com`;
      counter++;
    }

    // Генерация пароля
    const tempPassword = this.generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    const birthDate = new Date(dto.birthDate + 'T00:00:00.000Z');
    // Проверка валидности даты
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException('Invalid birthDate format');
    }
    // Создание пользователя
    const user = await this.prisma.user.create({
      data: {
        email: tempEmail,
        password: hashedPassword,
        role: UserRole.STUDENT,
        changePassword: true // Флаг для смены пароля при первом входе
      }
    });

    // Создание студента
    const student = await this.prisma.student.create({
      data: {
        ...dto,
        userId: user.id
      },
      include: { user: true }
    });

    // Возвращаем временные учетные данные
    return {
      ...student,
      user: {
        ...student.user,
        temporaryPassword: tempPassword
      }
    };
  }
  async getStudentById(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            createdAt: true
          }
        },
        medicalRecords: true,
        enrollmentHistory: {
          include: {
            classGroup: true
          }
        }
      }
    });
  }
}