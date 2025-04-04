import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { Prisma } from '@prisma/client';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }
  @Get() // GET /students
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAll() {
    return this.studentsService.getAllStudents();
  }
  @Post('create') // POST /students/create
  @Roles(UserRole.ADMIN)
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      const student = await this.studentsService.createStudent(createStudentDto);
      return {
        status: 'success',
        data: {
          id: student.id,
          fullName: student.fullName,
          class: student.class,
          login: student.user.email,
          temporaryPassword: student.user.temporaryPassword
        }
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Database error');
      }
      throw error;
    }
  }
  @Get(':id') // GET /students/:id
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const student = await this.studentsService.getStudentById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return {
      status: 'success',
      data: student
    };
  }
}