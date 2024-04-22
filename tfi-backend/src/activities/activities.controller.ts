import { Controller, Get, Post, Body } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @Post()
    async create(@Body() createActivityDto: CreateActivityDto) {
        return this.activitiesService.createActivity(createActivityDto);
    }

    @Get()
    async findAll() {
        return this.activitiesService.findAll();
    }
}