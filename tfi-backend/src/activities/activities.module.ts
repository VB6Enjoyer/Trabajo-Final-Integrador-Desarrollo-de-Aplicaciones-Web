import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesController } from './controllers/activities.controller';
import { ActividadesService } from './services/activities.service';
import { Activity } from './entities/activity.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuditsModule } from 'src/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), AuthModule, AuditsModule],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports: [ActividadesService]
})
export class ActivitiesModule { }