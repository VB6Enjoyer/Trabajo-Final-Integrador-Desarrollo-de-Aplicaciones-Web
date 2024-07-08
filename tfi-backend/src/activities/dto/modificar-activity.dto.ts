import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { PriorityEnum } from "../enums/prioridades.enum"
import { EstadosActividadEnum } from "../enums/estados.enum"
import { Usuario } from "src/auth/entities/usuario.entity"
import { Activity } from "../entities/activity.entity"

export class ModificarActivityDto {
    idActividades?

    @IsOptional()
    descripcion?: string

    @IsOptional()
    idUsuario_actual

    @IsOptional()
    prioridad?: PriorityEnum

    @IsOptional()
    estado?: EstadosActividadEnum;
 
    @IsOptional()
    idUsuario_modificacion: Usuario;    
}