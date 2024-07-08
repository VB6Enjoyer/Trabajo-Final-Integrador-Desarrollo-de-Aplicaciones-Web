import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from '../entities/audit.entity';
import { CreateAuditDto } from '../dtos/create-audit.dto';

@Injectable()
export class AuditsService {
    constructor(
        @InjectRepository(Audit) private auditRepository: Repository<Audit>,
    ) { }

    async createAudit(createAuditDto: CreateAuditDto) {
        const audit = new Audit();

        const auditsArray = await this.getAudits();

        audit.idActividades_autoria = auditsArray[auditsArray.length - 1].idActividades_autoria + 1;
        audit.descripcion = createAuditDto.descripcion;
        audit.prioridad = createAuditDto.prioridad;
        audit.fecha_Modificacion = new Date();
        audit.estado = createAuditDto.estado;
        audit.operacion = createAuditDto.operation;
        audit.idUsuario_actual = createAuditDto.idUsuario_actual;
        audit.idUsuario_modificacion = createAuditDto.idUsuario_modificacion;
        audit.idActividad = createAuditDto.idActividad;

        await this.auditRepository.save(audit);
        console.log(audit)

        return audit;
    }

    async getAudits(): Promise<Audit[]> {
        const query = this.auditRepository
            .createQueryBuilder('actividades_autoria')

        return await query.getMany();
    }

    async getAuditsId(idActividad: number): Promise<Audit[]> {
        return await this.auditRepository.find({
            where: { idActividad: { idActividades: idActividad } },
            relations: ['idActividad', 'idUsuario_actual', 'idUsuario_modificacion'] // Asegurarnos de cargar las relaciones necesarias
        });
    }
      
}
