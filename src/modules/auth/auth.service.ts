
// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Buscar usuario incluyendo el password
    const user = await this.usersService['usersRepository'].findOne({ where: { username }, select: ['id', 'username', 'password', 'email', 'roles'] });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    // No retornar el password
    const { password: _pw, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        algorithm: 'RS256',
        expiresIn: '15m', // Expiración corta
      }),
    };
  }
  async register(registerDto: RegisterDto) {
    // Crea el usuario usando UsersService
    const user = await this.usersService.createOrUpdate(registerDto);
    // No retornar el password
    const { password, ...result } = user;
    return result;
  }
}