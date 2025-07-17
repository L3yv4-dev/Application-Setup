import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario1' })
  @IsString()
  @MinLength(4)
  username: string = '';

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string = '';
}