import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ActivitiesModule } from './activities/activities.module';
import { AuditsModule } from './audits/audits.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'username',
      password: 'password',
      database: 'tfi_db',
      autoLoadEntities: true,
      synchronize: false,
      logger: 'advanced-console'
    }),
    AuthModule,
    ActivitiesModule,
    AuditsModule,
    JwtModule.register({
      global: true,
      secret: 'tpidawsecreto',
      signOptions: {
        expiresIn: '24h'
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }