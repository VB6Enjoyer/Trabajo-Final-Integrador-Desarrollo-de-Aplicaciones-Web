import { EstadosActividadEnum } from "../enums/estados-actividad.enum";
import { PrioridadesEnum } from "../enums/prioridades.enum";
import { UsuarioDto } from "./usuario.dto";

export interface ActividadDto{
    
    idActividades: number;

    descripcion: string;

    prioridad: PrioridadesEnum|null;

    fechaModificacion: string|null;

    estado: EstadosActividadEnum|null;
  
    idUsuario_actual: UsuarioDto |null;

    idUsuario_modificacion: UsuarioDto|null
}