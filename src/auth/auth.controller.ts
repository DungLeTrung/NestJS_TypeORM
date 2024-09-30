import { Body, Controller, Post } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { RefreshTokenDTO } from './dto/refresh_token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMessage('LOGIN ACCOUNT')
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ResponseMessage('REGISTERED ACCOUNT')
  async register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDTO: RefreshTokenDTO) {
    return this.authService.refreshToken(refreshTokenDTO);
  }
}
