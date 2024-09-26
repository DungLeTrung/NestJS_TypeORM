import { IsString, IsEmail } from 'class-validator';

export class LoginDTO {
    @IsEmail()
    username: string;

    @IsString()
    password: string;
}
