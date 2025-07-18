import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        privateKey: fs.readFileSync(configService.get<string>('JWT_PRIVATE_KEY_PATH')!, 'utf8'),
        publicKey: fs.readFileSync(configService.get<string>('JWT_PUBLIC_KEY_PATH')!, 'utf8'),
        signOptions: { algorithm: 'RS256', expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}