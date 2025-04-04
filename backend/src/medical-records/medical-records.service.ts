import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.prisma.medicalRecord.create({
      data: {
        description: createMedicalRecordDto.description,
        recordDate: new Date(createMedicalRecordDto.recordDate),
        fileUrl: createMedicalRecordDto.fileUrl,
        student: {
          connect: { id: createMedicalRecordDto.studentId }
        }
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.medicalRecord.findMany({
      include: {
        student: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }

  async findByStudent(studentId: number) {
    return this.prisma.medicalRecord.findMany({
      where: { studentId },
      include: {
        student: true
      }
    });
  }

  async update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return this.prisma.medicalRecord.update({
      where: { id },
      data: updateMedicalRecordDto
    });
  }

  async remove(id: number) {
    return this.prisma.medicalRecord.delete({
      where: { id }
    });
  }
}