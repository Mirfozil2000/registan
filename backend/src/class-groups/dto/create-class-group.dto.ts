import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateClassGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  grade: number;

  @IsInt()
  @IsNotEmpty()
  academicYear: number;
}