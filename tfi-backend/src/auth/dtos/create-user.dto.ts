import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { EstadosUsuarioEnum } from "../enums/estado-usuario.enum"
import { RolesEnum } from "../enums/roles.enum"

export class CreateUserDto {
    @IsString()
    email: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    apellido: string

    @IsNotEmpty()
    nombre: string

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    rol: RolesEnum;

    @IsOptional()
    estado: EstadosUsuarioEnum;
}