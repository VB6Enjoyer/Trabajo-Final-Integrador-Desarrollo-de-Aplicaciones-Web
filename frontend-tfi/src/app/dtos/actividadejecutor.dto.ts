import { EstadosActividadEnum } from "../enums/estados-actividad.enum";
import { PrioridadesEnum } from "../enums/prioridades.enum";
import { EditActividadDto } from "./edit-actividad.dto";
import { UsuarioDto } from "./usuario.dto";

export interface ActividadEjecutorDto{
    
    idActividades: number;

    descripcion: string|null;

    prioridad: PrioridadesEnum|null;

    fechaModificacion: string|null;

    estado: EstadosActividadEnum|null;
  
    idUsuario_actual: UsuarioDto|null;
}