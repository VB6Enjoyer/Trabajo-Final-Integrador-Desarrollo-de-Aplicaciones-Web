import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivityService } from './entities/activity/activity.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivityService]
})
export class ActivitiesModule {}
