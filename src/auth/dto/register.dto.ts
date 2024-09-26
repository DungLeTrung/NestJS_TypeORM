import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
