import { IsNotEmpty, IsString } from "class-validator"
import { PrimaryGeneratedColumn } from 'typeorm';
import { PriorityEnum } from '../enums/prioridades.enum';
import { EstadosActividadEnum } from '../enums/estados.enum';
import { OperacionAutoriaEnum } from '../enums/operacion.enum';

export class CreateAuditDto {
    @PrimaryGeneratedColumn({ name: 'idActividades_autoria' })
    idActividades_autoria: number;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    prioridad: PriorityEnum

    @IsNotEmpty()
    estado: EstadosActividadEnum

    @IsNotEmpty()
    operation: OperacionAutoriaEnum

    @IsNotEmpty()
    idUsuario_actual;

    @IsNotEmpty()
    idUsuario_modificacion;

    @IsNotEmpty()
    idActividad;
}