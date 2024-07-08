import { EstadosUsuarioEnum } from "../enums/estados-usuario.enum";
import { RolesEnum } from "../enums/roles.enum";

export interface UsuarioCrearDto{

    idUsuarios: any;

    apellido: string;

    nombre: string;

    username: string;

    email: string;

    password: string;

    estado: EstadosUsuarioEnum;

    rol: RolesEnum;
}