import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ClassGroupsService } from './class-groups.service';
import { CreateClassGroupDto } from './dto/create-class-group.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassGroupsController {
  constructor(private readonly classGroupsService: ClassGroupsService) {}
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createClassGroupDto: CreateClassGroupDto) {
    return this.classGroupsService.createClassGroup(createClassGroupDto);
  }
  @Get(':id/students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStudents(@Param('id') id: string) {
    return this.classGroupsService.getClassStudents(parseInt(id));
  }
}