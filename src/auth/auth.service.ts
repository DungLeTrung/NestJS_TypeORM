import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDTO: LoginDTO) {
        const user = await this.userService.findByUsername(loginDTO.username);
        if (user && await bcrypt.compare(loginDTO.password, user.password)) {
            const payload = { username: user.username, sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
                user,
            };
        }
        throw new Error('Invalid credentials');
    }

    async register(registerDTO: RegisterDTO) {
        const existingUser = await this.userService.findByUsername(registerDTO.username);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser = await this.userService.create(registerDTO);
        const payload = { username: newUser.username, sub: newUser.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: newUser,
        };
    }
}
