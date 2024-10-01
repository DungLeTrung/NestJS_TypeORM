import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponse, RegisterResponse, Role } from 'src/config/const';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh_token.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<AuthResponse> {
    try {
      const user = await this.userService.findByEmail(loginDTO.email);
      if (user && (await bcrypt.compare(loginDTO.password, user.password))) {
        const payload = { email: user.email, role: user.role, sub: user.id };

        const accessToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRE,
        });

        const refreshToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRE,
        });

        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          user,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        'Login failed. Please check your credentials.',
        error.message,
      );
    }
  }

  async register(registerDTO: RegisterDTO): Promise<RegisterResponse> {
    try {
      const existingUser = await this.userService.findByEmail(
        registerDTO.email,
      );
      if (existingUser) {
        throw new BadRequestException('User already exists with this email.');
      }

      const newUser = await this.userService.create({
        ...registerDTO,
        role: Role.USER,
      });

      return {
        message: 'User registered successfully. Please login to continue.',
        user: newUser,
      };
    } catch (error) {
      throw new BadRequestException(
        'User already exists with this email or username.',
        error.message,
      );
    }
  }

  async refreshToken(refreshTokenDTO: RefreshTokenDTO): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshTokenDTO.refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new BadRequestException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub, role: payload.role },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRE,
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub, role: payload.role },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRE,
        },
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        user,
      };
    } catch (error) {
      throw new BadRequestException(
        'Refresh Token is not successfully',
        error.message,
      );
    }
  }
}
