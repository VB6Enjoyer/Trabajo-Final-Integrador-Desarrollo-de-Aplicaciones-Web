import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
    ) { }

    async createActivity(createActivityDto: CreateActivityDto): Promise<Activity> {
        const newActivity = this.activityRepository.create(createActivityDto);
        return this.activityRepository.save(newActivity);
    }

    async findAll(): Promise<Activity[]> {
        return this.activityRepository.find();
    }
}