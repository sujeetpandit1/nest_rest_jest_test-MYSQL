import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
      return {message: "User Registered Successfully" , data: data || ''}
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const data = await this.userService.loginUser(loginUserDto);
    return {message: "Login Success", data: data}
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async listUsers(@Req() req:any) {
    let role = req.user.role;
    // console.log(role);

    if(role !== 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }    

    const data = await this.userService.listUsers();
    return {data: data || ''}
  }

}
