import { PrioridadesEnum } from '../enums/prioridades.enum';
import { EstadosActividadEnum } from '../enums/estados-actividad.enum';
import { UsuarioDto } from './usuario.dto';

export interface EditActividadDto {
  idActividades?: number

  descripcion?: string

  idUsuario_actual: any

  prioridad?: PrioridadesEnum

  estado?: EstadosActividadEnum;

}
