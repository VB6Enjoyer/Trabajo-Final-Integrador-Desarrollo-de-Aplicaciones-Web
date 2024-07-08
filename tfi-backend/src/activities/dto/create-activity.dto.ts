import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { PriorityEnum } from "../enums/prioridades.enum"
import { Usuario } from "src/auth/entities/usuario.entity"
import { EstadosActividadEnum } from "../enums/estados.enum"

export class CreateActivityDto {

    @IsString()
    descripcion: string

    @IsNotEmpty()
    prioridad: PriorityEnum

    @IsNotEmpty()
    estado: EstadosActividadEnum

    @IsOptional()
    idUsuario_actual: number

    @IsOptional()
    idUsuario_modificacion: Usuario
}