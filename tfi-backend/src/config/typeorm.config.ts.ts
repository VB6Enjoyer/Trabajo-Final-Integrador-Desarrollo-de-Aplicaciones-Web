import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'tfi_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
