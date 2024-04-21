import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @IsNotEmpty({ message: 'First Name is required' })
    @IsString({ message: 'First Name must be a string' })
    firstName: string;

    @IsOptional()
    @IsString({ message: 'Last Name must be a string' })
    lastName?: string;


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


    @IsNotEmpty({ message: 'Role is required' })
    @IsString({ message: 'Role must be a string' })
    @IsEnum(['admin', 'user', 'other'], { message: 'Role must be either admin, user, or other' })
    role: string;

    @IsNotEmpty({ message: 'Mobile number is required' })
    @IsString({ message: 'Mobile number must be a string' })
    @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
    mobile_no: string;
}


