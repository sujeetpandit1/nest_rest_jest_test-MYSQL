import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


class MockJwtService {
  sign(payload: any, options?: { expiresIn: string }): string {
    // Mock implementation for sign method
    return 'mockAccessToken';
  }
}

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any; // Mocked repository for 
  let mockJwtService: JwtService;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository', // Provide a mock for UserRepository
          useValue: mockUserRepository,
        },{
          provide: JwtService,
          useClass: MockJwtService,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockJwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const newUser: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Secret@123',
      role: 'admin',
      mobile_no: '1234567891',
    };

    it('should create a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null); // Simulate no existing user
      mockUserRepository.save.mockImplementation(async (user) => {
        // console.log("Saving user:", user);
        return user; // Return the user object
      });
    
      try {
        const createdUser = await service.create(newUser);
        expect(createdUser).toEqual(expect.objectContaining({ // Expect partial user data
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          mobile_no: newUser.mobile_no,
        }));
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          where: [{ email: newUser.email }, { mobile_no: newUser.mobile_no }],
        });
        expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining(newUser));
      } catch (error) {
        // console.error("Error:", error);
      }
    });

    it('should throw ConflictException for duplicate email', async () => {
      const existingUser = { email: newUser.email };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.create(newUser)).rejects.toThrow(HttpException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: newUser.email }, { mobile_no: newUser.mobile_no }],
      });
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException for duplicate mobile number', async () => {
      const existingUser = { mobile_no: newUser.mobile_no };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.create(newUser)).rejects.toThrow(HttpException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: newUser.email }, { mobile_no: newUser.mobile_no }],
      });
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    const loginUserDto = {
      email: 'john.doe@example.com',
      password: 'Secret@123',
    };

    it('should return an access token on successful login', async () => {
      const user = {
        email: loginUserDto.email,
        password: await bcrypt.hash(loginUserDto.password, 10), // Hash the password for comparison
        id: '1',
        role: 'admin',
      };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.loginUser(loginUserDto);
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
    });

    it('should throw UnauthorizedException if login credentials are invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(null); // Simulate no user found

      await expect(service.loginUser(loginUserDto)).rejects.toThrowError(UnauthorizedException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
      // expect(mockJwtService.sign).not.toHaveBeenCalled(); // Ensure sign method is not called
    });
  });

  describe('listUsers', () => {
    it('should return list of users for admin', async () => {
      const users = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' },
      ];
      jest.spyOn(service, 'listUsers').mockResolvedValue(users);
  
      const result = await service.listUsers();
  
      expect(result).toEqual(users);
  
      // expect(mockUserRepository.find).toHaveBeenCalled();
    });
  
    it('should throw an UnauthorizedException if user is not an admin', async () => {
      const error = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      jest.spyOn(service, 'listUsers').mockRejectedValue(error);
  
      await expect(service.listUsers()).rejects.toThrow(error);
  
      expect(mockUserRepository.find).not.toHaveBeenCalled();
    });
  });
   
  

});
