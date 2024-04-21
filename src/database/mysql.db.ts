import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";


dotenv.configDotenv();

export const dataSourceOptions:DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD as string,
  database: process.env.MYSQL_DB,
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
  entities: [Product, User], // Include the entity directly
  migrations: ['src/migrations/*.ts'],
  synchronize: true, // Change to 'false' in production for migrations
}


const dataSource = new DataSource(dataSourceOptions);

export default dataSource;