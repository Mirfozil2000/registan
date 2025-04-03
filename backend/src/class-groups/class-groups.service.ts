import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassGroupsService {
    constructor(private prisma: PrismaService) { }
    async createClassGroup(data: { name: string; grade: number; academicYear: number }) {
        return this.prisma.classGroup.create({
            data,
        });
    }
    async getClassStudents(classGroupId: number) {
        return this.prisma.classGroup.findUnique({
            where: { id: classGroupId },
            include: {
                students: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
}