import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';



describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            loginUser: jest.fn(),
            listUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Secret@123',
      role: 'admin',
      mobile_no: '1234567891',
    };

    it('should create a new user', async () => {
      const createSpy = jest
        .spyOn(userService, 'create')
        .mockImplementation(() => Promise.resolve(createUserDto));

      const result = await controller.create(createUserDto);

      expect(createSpy).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        data: createUserDto,
        message: 'User Registered Successfully',
      });
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user already exists', async () => {
      const createSpy = jest
        .spyOn(userService, 'create')
        .mockImplementation(() => {
          throw new HttpException('User already exists', HttpStatus.CONFLICT);
        });

      await expect(controller.create(createUserDto)).rejects.toThrowError(
        new HttpException('User already exists', HttpStatus.CONFLICT),
      );
    });
  });

  describe('login', () => {
    const loginUserDto: LoginUserDto = {
      email: 'john.doe@example.com',
      password: 'Secret@123',
    };

    it('should return login success message and data', async () => {
      const loginData = { accessToken: 'mockAccessToken' };
      jest.spyOn(userService, 'loginUser').mockResolvedValue(loginData);

      const result = await controller.login(loginUserDto);

      expect(result).toEqual({ message: 'Login Success', data: loginData });
    });

    it('should throw an error if login fails', async () => {
      const error = new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
      jest.spyOn(userService, 'loginUser').mockRejectedValue(error);

      await expect(controller.login(loginUserDto)).rejects.toThrowError(error);
    });
  });

  describe('listUsers', () => {
    it('should return list of users for admin', async () => {
      const users = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' },
      ];
      jest.spyOn(userService, 'listUsers').mockResolvedValue(users);
  
      const result = await controller.listUsers({ user: { role: 'admin' } });
  
      expect(result).toEqual({ data: users });
    });
  
    it('should throw an UnauthorizedException if user is not an admin', async () => {
      const error = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      jest.spyOn(userService, 'listUsers').mockRejectedValue(error);
    
      await expect(controller.listUsers({ user: { role: 'user' } })).rejects.toThrow(
        HttpException,
      );
    
      expect(userService.listUsers).toHaveBeenCalledTimes(0);
    });
  });
  
});
