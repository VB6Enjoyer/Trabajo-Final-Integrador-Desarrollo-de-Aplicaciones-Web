import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Audit } from './entities/audit.entity';
import { AuditsService } from './services/audits.service';
import { AuditsController } from './controllers/audits.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Audit]), AuthModule],
    controllers: [AuditsController],
    providers: [AuditsService],
    exports: [AuditsService]
})
export class AuditsModule { }