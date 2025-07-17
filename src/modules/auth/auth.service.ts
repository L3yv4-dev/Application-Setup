// filepath: d:\Trabajo_Sidney\Node\Application-Setup\src\auth\auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        algorithm: 'RS256',
        expiresIn: '15m', // Expiración corta
      }),
    };
  }
}