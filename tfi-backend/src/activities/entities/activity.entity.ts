import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PriorityEnum } from '../enums/prioridades.enum';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { EstadosActividadEnum } from '../enums/estados.enum';

@Entity({ name: 'actividades' })
export class Activity {
    @PrimaryGeneratedColumn({ name: 'idActividades' })
    idActividades: number;

    @Column({ name: 'descripcion' })
    descripcion: string;

    @Column({ name: 'prioridad' })
    prioridad: PriorityEnum

    @Column({ name: 'fecha_modificacion', type: "timestamp" })
    fecha_modificacion: Date;


    @Column({ name: 'estado' })
    estado: EstadosActividadEnum;

    @ManyToOne(() => Usuario, usuario => usuario.idUsuarios)
    @JoinColumn({ name: 'idUsuario_actual' })
    idUsuario_actual: Usuario;

    @ManyToOne(() => Usuario, usuario => usuario.idUsuarios)
    @JoinColumn({ name: 'idUsuario_modificacion' })
    idUsuario_modificacion: Usuario;


}