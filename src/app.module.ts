import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/mysql.db';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    ProductModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
