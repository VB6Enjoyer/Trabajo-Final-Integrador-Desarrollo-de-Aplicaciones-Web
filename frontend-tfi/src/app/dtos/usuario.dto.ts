import { EstadosUsuarioEnum } from "../enums/estados-usuario.enum";
import { RolesEnum } from "../enums/roles.enum";

export interface UsuarioDto{

    idUsuarios: any;

    apellido: string;

    nombre: string;

    nombreUsuario: string;

    email: string;

    password: string;

    estado: EstadosUsuarioEnum;

    rol: RolesEnum;
}