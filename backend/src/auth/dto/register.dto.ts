import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role?: UserRole;
}