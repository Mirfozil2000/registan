import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() dto: CreateMedicalRecordDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll() {
    return this.service.findAll();
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByStudent(@Param('studentId') studentId: string) {
    return this.service.findByStudent(parseInt(studentId));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateMedicalRecordDto) {
    return this.service.update(parseInt(id), dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(parseInt(id));
  }
}