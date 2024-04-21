import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {

    @IsString({ message: 'Email must be a string' })
    @IsEmail({}, { message: 'Email must be a valid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email is required' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, {
        message: 'Password must contain at least one letter, one number, and one special character'
    })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(16, { message: 'Password must be at most 16 characters long' })
    password: string;

}


