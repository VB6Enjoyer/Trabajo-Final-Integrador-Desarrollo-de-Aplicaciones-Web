import { EstadosUsuarioEnum } from '../enums/estados-usuario.enum';
import { RolesEnum } from '../enums/roles.enum';
import { UsuarioDto } from './usuario.dto';

export interface CreateUsuarioDto {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  rol: RolesEnum;
  estado: EstadosUsuarioEnum;
}