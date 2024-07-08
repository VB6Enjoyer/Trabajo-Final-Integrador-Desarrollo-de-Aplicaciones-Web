import { EstadosActividadEnum } from '../enums/estados-actividad.enum';
import { PrioridadesEnum } from '../enums/prioridades.enum';
import { UsuarioDto } from './usuario.dto';

export interface CreateActividadDto {
  descripcion: string;
  prioridad: PrioridadesEnum;
  estado: EstadosActividadEnum;
  idUsuario_actual: UsuarioDto;
}