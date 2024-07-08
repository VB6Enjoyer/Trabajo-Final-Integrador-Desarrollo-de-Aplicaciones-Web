import { EstadosActividadEnum } from "../enums/estados-actividad.enum";
import { PrioridadesEnum } from "../enums/prioridades.enum";
import { UsuarioDto } from "./usuario.dto";

export interface AuditoriaDto {

  idActividades_autoria: number;

  descripcion: string|null;

  prioridad: PrioridadesEnum|null;

  fecha_modificacion: string|null;

  estado: EstadosActividadEnum|null;

  operacion: string
}
