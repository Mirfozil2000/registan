import { IsDateString, IsNotEmpty, IsString, IsOptional, IsISO8601 } from 'class-validator';

export class CreateStudentResponseDto {
  id: number;
  fullName: string;
  class: string;
  user: {
    email: string;
    temporaryPassword: string;
  };
}

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsISO8601({ strict: false }) // Разрешаем дату без времени
  @IsNotEmpty()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  class: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  phone?: string;
}