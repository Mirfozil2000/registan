import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMedicalRecordDto {
    @IsNumber()
    @IsNotEmpty()
    studentId: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    recordDate: string;

    @IsString()
    @IsOptional()
    fileUrl?: string;
}