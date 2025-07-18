//auth.controller.ts
import { Controller, Post, Body, HttpCode, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Endpoint para registrar un usuario
   */
  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  /**
   * Endpoint para iniciar sesión y obtener un token JWT.
   * @param loginDto - Objeto que contiene las credenciales del usuario.
   * @returns Un objeto que contiene el token JWT.
   */
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login y obtención de JWT' })
  @ApiResponse({ status: 200, description: 'Token JWT generado' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {

    // Validando el usuario contra la base de datos
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}


