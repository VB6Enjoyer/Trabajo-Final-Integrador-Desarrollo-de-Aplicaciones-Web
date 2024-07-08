import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PriorityEnum } from '../enums/prioridades.enum';
import { EstadosActividadEnum } from '../enums/estados.enum';
import { OperacionAutoriaEnum } from '../enums/operacion.enum';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { Activity } from 'src/activities/entities/activity.entity';

@Entity({ name: 'actividades_autoria' })
export class Audit {
    @PrimaryGeneratedColumn({ name: 'idActividades_autoria' })
    idActividades_autoria: number;

    @Column({ name: 'descripcion' })
    descripcion: string;

    @Column({ name: 'prioridad' })
    prioridad: PriorityEnum

    @Column({ name: 'fecha_modificacion', type: "timestamp" })
    fecha_Modificacion: Date

    @Column({ name: 'estado' })
    estado: EstadosActividadEnum

    @Column({ name: 'operacion' })
    operacion: OperacionAutoriaEnum
  
  @ManyToOne(() => Usuario, usuario => usuario.idUsuario_modificacion)
  @JoinColumn({ name: 'idUsuario_modificacion' })
  idUsuario_modificacion: Usuario;

  @ManyToOne(() => Usuario, usuario => usuario.idUsuario_actual)
  @JoinColumn({ name: 'idUsuario_actual' })
  idUsuario_actual: Usuario;

  @ManyToOne(() => Activity, actividad => actividad.idActividades)
  @JoinColumn({ name: 'idActividad' })
  idActividad: Activity;

}