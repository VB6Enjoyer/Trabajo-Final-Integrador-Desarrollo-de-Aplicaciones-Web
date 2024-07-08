import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstadosUsuarioEnum } from '../enums/estado-usuario.enum';
import { RolesEnum } from '../enums/roles.enum';
import { Exclude, Expose } from 'class-transformer'
import { Activity } from 'src/activities/entities/activity.entity';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'idUsuarios' })
  idUsuarios: number

  @Column({ name: 'email' })
  email: string

  @Exclude()
  @Column()
  clave: string

  @Column({ name: 'apellido' })
  apellido: string

  @Column({ name: 'nombre' })
  nombre: string

  @Column({ type: 'enum', enum: EstadosUsuarioEnum, name: 'estado' })
  estado: EstadosUsuarioEnum

  @Column({ name: 'nombreUsuario' })
  nombreUsuario: string

  @Column({ type: 'enum', enum: RolesEnum, name: 'rol' })
  rol: RolesEnum

  @OneToMany(() => Activity, activity => activity.idUsuario_modificacion)
  idUsuario_modificacion: Activity[];

  @OneToMany(() => Activity, activity => activity.idUsuario_actual)
  idUsuario_actual: Activity[];

  @Expose()
  get nombreCompleto(): string {
    return this.apellido + ', ' + this.nombre;
  }
}