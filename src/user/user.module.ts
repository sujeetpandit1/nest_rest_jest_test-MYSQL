import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions:{expiresIn:process.env.JWT_EXPIRES}
    }),
  TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports:[JwtModule]
})
export class UserModule {}
