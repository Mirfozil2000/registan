import { Module } from '@nestjs/common';
import { ClassGroupsService } from './class-groups.service';
import { ClassGroupsController } from './class-groups.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ClassGroupsController],
  providers: [ClassGroupsService, PrismaService],
})
export class ClassGroupsModule {}