import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
    @IsString()
    @IsNotEmpty()
    @IsEmail()    
    email: string;

    @IsString()
    password: string;
}
