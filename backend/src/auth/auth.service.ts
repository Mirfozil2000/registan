import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'src/enums/user-role.enum';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) { }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async register(registerDto: RegisterDto) {
    const usersCount = await this.prisma.user.count();
    const role = usersCount === 0 ? UserRole.STUDENT : registerDto.role;
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      role,
    });
    const { password, ...userData } = user;
    return {
      status: 'success',
      message: 'User successfully registered',
      data: {
        user: userData,
        access_token: this.generateJwtToken(user).access_token,
      }
    };
  }
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        changePassword: true, // Добавляем поле changePassword
        createdAt: true,
        updatedAt: true,
      }
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Проверка необходимости смены пароля
    if (user.changePassword) {
      throw new ForbiddenException('Password change required');
    }
    const { password, changePassword, ...userData } = user;
    return {
      status: 'success',
      message: 'Login successful',
      data: {
        user: userData,
        access_token: this.generateJwtToken(user).access_token,
      }
    };
  }
  private generateJwtToken(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      changePassword: user.changePassword 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async changePassword(userId: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        changePassword: false
      }
    });
  }
}