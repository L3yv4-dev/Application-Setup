import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario123' })
  // @IsString()
  // @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  // @IsString()
  // @IsNotEmpty()
  password: string;
}
