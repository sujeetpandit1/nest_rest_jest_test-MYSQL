import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}
  async create(createUserDto: CreateUserDto): Promise<Partial<CreateUserDto>> {
    const {firstName, lastName, email, password, role, mobile_no} = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { mobile_no }]
    });

    if (existingUser) { //this validation can be used for both postegres and mysql db, to avoid additional call, choose try and catch
      if (existingUser.email === email) {
        throw new HttpException(`Email (${existingUser.email}) Already Exists`, HttpStatus.CONFLICT);
      } else {
        throw new HttpException(`Mobile Number (${existingUser.mobile_no}) Already Exists`, HttpStatus.CONFLICT);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({firstName, lastName, email, password: hashedPassword, role, mobile_no});

    try {
    const savedUser = await this.userRepository.save(newUser);
    const {password: omitPassword, ...userData} = savedUser;
    return userData;

    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') { //for postegres and mysql code isn different
          throw new ConflictException(error.detail);
        } else {
          throw new InternalServerErrorException();
        }
      }
    }  
  
    
  async loginUser(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const {email, password} = loginUserDto;
    const user = await this.userRepository.findOne({where: {email: email}});

    if (user && (await bcrypt.compare(password, user.password))) { 
      let payload = { email: user.email, id: user.id, role: user.role};
      let accessToken =  this.jwtService.sign(payload, {secret:process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES})
      return {accessToken}
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }


  async listUsers(): Promise<any> {
    const users = await this.userRepository.find();

    const data = users.map(user => {
      const { password, createdAt, updatedAt, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return data;
  }

  
}
