import { Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { InjectRepository} from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { Like, Repository } from 'typeorm';
import { EstadosActividadEnum } from '../enums/estados.enum';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { ModificarActivityDto } from '../dto/modificar-activity.dto';
import { EliminarActivityDto } from '../dto/eliminar-actividad'; import { UsuariosService } from 'src/auth/servicies/usuarios.service';
import { EstadosUsuarioEnum } from 'src/auth/enums/estado-usuario.enum';
import { AuditsService } from 'src/audits/services/audits.service';
import { OperacionAutoriaEnum } from 'src/audits/enums/operacion.enum';
import { CreateAuditDto } from 'src/audits/dtos/create-audit.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { audit } from 'rxjs';


@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Activity) private actividadesRepo: Repository<Activity>,
    private auditsService: AuditsService,
    private usuariosService: UsuariosService,
    private readonly entityManager: EntityManager,
  ) { }

  async crearActividad(crearActividadDto: CreateActivityDto): Promise<Activity> {
    try {
      const usuarioModificacion = await this.usuariosService.obtenerUsuarioPorId(
        crearActividadDto.idUsuario_modificacion?.idUsuarios,
        EstadosUsuarioEnum.ACTIVO
      );
      
      if (!usuarioModificacion) {
        throw new NotFoundException('Usuario de modificación no encontrado.');
      }

      const actividad = new Activity();

      actividad.descripcion = crearActividadDto.descripcion;
      actividad.prioridad = crearActividadDto.prioridad;

      actividad.fecha_modificacion = new Date(); 

      actividad.idUsuario_modificacion = usuarioModificacion;

      await this.actividadesRepo.save(actividad);

      const newAudit = new CreateAuditDto();
      newAudit.descripcion = actividad.descripcion;
      newAudit.prioridad = actividad.prioridad;
      newAudit.estado = EstadosActividadEnum.PENDIENTE;
      newAudit.operation = OperacionAutoriaEnum.CREACION;
      newAudit.idUsuario_actual = actividad.idUsuario_modificacion.idUsuarios;
      newAudit.idUsuario_modificacion = actividad.idUsuario_modificacion.idUsuarios;
      newAudit.idActividad = actividad.idActividades;

      await this.auditsService.createAudit(newAudit);

      return actividad;
    } catch (error) {
      console.error('Error en crearActividad:', error);
      throw error; 
    }
  }


  async modificarActividad(modificarActividadDto: ModificarActivityDto): Promise<Activity> {
    try {
      console.log('modificarActividadDto:', modificarActividadDto);

      let nuevoUsuarioResponsable: Usuario | undefined;
      if (modificarActividadDto.idUsuario_actual !== undefined) {
        nuevoUsuarioResponsable = await this.usuariosService.obtenerUsuarioPorId(
          modificarActividadDto.idUsuario_actual,
          EstadosUsuarioEnum.ACTIVO
        );
        if (!nuevoUsuarioResponsable) {
          throw new NotFoundException('Usuario responsable no encontrado.');
        }
        console.log('nuevoUsuarioResponsable:', nuevoUsuarioResponsable);
      }

      let usuarioModificante: Usuario | undefined;
      if (modificarActividadDto.idUsuario_modificacion !== undefined) {
        usuarioModificante = await this.usuariosService.obtenerUsuarioPorId(
          modificarActividadDto.idUsuario_modificacion.idUsuarios,
          EstadosUsuarioEnum.ACTIVO
        );
        if (!usuarioModificante) {
          throw new NotFoundException('Usuario modificante no encontrado.');
        }
        console.log('usuarioModificante:', usuarioModificante);
      } else {
        usuarioModificante = nuevoUsuarioResponsable;
      }

      if (!usuarioModificante) {
        throw new NotFoundException('Usuario modificante no definido.');
      }

      const actividad = await this.actividadesRepo.findOne({
        where: { idActividades: modificarActividadDto.idActividades },
        relations: ['idUsuario_actual', 'idUsuario_modificacion']
      });
      if (!actividad) {
        throw new NotFoundException('Actividad no encontrada.');
      }

      if (usuarioModificante.rol === RolesEnum.EJECUTOR && actividad.idUsuario_actual.idUsuarios !== usuarioModificante.idUsuarios) {
        throw new UnauthorizedException("No puedes modificar actividades de otros usuarios.");
      }

      if (modificarActividadDto.descripcion !== undefined) {
        actividad.descripcion = modificarActividadDto.descripcion;
      }
      if (modificarActividadDto.prioridad !== undefined) {
        actividad.prioridad = modificarActividadDto.prioridad;
      }
      if (modificarActividadDto.idUsuario_actual !== undefined && usuarioModificante.rol === RolesEnum.ADMINISTRADOR) {
        actividad.idUsuario_actual = nuevoUsuarioResponsable;
      }
      if (modificarActividadDto.estado !== undefined) {
        actividad.estado = modificarActividadDto.estado;
      }
      if (modificarActividadDto.idUsuario_modificacion !== undefined) {
        actividad.idUsuario_modificacion = usuarioModificante;
      } else {
        actividad.idUsuario_modificacion = nuevoUsuarioResponsable;
      }

      actividad.fecha_modificacion = new Date();

      await this.actividadesRepo.save(actividad);

      const newAudit = new CreateAuditDto();
      newAudit.descripcion = actividad.descripcion;
      newAudit.prioridad = actividad.prioridad;
      newAudit.estado = actividad.estado;
      newAudit.operation = actividad.estado === EstadosActividadEnum.ELIMINADO 
        ? OperacionAutoriaEnum.ELIMINACION 
        : OperacionAutoriaEnum.MODIFICACION;
      newAudit.idUsuario_actual = actividad.idUsuario_actual.idUsuarios;
      newAudit.idUsuario_modificacion = actividad.idUsuario_modificacion.idUsuarios;
      newAudit.idActividad = actividad.idActividades;

      

      const usuarioActual = await this.usuariosService.obtenerUsuarioPorId(newAudit.idUsuario_actual, EstadosUsuarioEnum.ACTIVO);
      const usuarioMod = await this.usuariosService.obtenerUsuarioPorId(newAudit.idUsuario_modificacion, EstadosUsuarioEnum.ACTIVO);
  
      if (!usuarioActual) {
        throw new NotFoundException(`El usuario con ID ${newAudit.idUsuario_actual} no existe.`);
      }
      if (!usuarioMod) {
        throw new NotFoundException(`El usuario con ID ${newAudit.idUsuario_modificacion} no existe.`);
      }

      await this.auditsService.createAudit(newAudit);

      return actividad;
    } catch (error) {
      console.error('Error en modificarActividad:', error);
      throw error;
    }
  }



  async marcarfinalizada(modificarActividadDto: ModificarActivityDto): Promise<Activity> {
    try {
      console.log('modificarActividadDto:', modificarActividadDto);
  
      let nuevoUsuarioResponsable: Usuario | undefined;
      if (modificarActividadDto.idUsuario_actual !== undefined) {
        nuevoUsuarioResponsable = await this.usuariosService.obtenerUsuarioPorId(
          modificarActividadDto.idUsuario_actual,
          EstadosUsuarioEnum.ACTIVO
        );
        if (!nuevoUsuarioResponsable) {
          throw new NotFoundException('Usuario responsable no encontrado.');
        }
        console.log('nuevoUsuarioResponsable:', nuevoUsuarioResponsable);
      }
  
      let usuarioModificante: Usuario | undefined;
      if (modificarActividadDto.idUsuario_modificacion !== undefined) {
        usuarioModificante = await this.usuariosService.obtenerUsuarioPorId(
          modificarActividadDto.idUsuario_modificacion.idUsuarios,
          EstadosUsuarioEnum.ACTIVO
        );
        if (!usuarioModificante) {
          throw new NotFoundException('Usuario modificante no encontrado.');
        }
        console.log('usuarioModificante:', usuarioModificante);
      } else {
        usuarioModificante = nuevoUsuarioResponsable;
      }
  
      if (!usuarioModificante) {
        throw new NotFoundException('Usuario modificante no definido.');
      }
  
      const actividad = await this.actividadesRepo.findOne({
        where: { idActividades: modificarActividadDto.idActividades },
        relations: ['idUsuario_actual', 'idUsuario_modificacion']
      });
      if (!actividad) {
        throw new NotFoundException('Actividad no encontrada.');
      }
  
      actividad.estado = EstadosActividadEnum.FINALIZADO;
  
      actividad.fecha_modificacion = new Date();
  
      await this.actividadesRepo.save(actividad);
  
      const newAudit = new CreateAuditDto();
      newAudit.descripcion = actividad.descripcion;
      newAudit.prioridad = actividad.prioridad;
      newAudit.estado = actividad.estado;
      newAudit.operation = actividad.estado === EstadosActividadEnum.FINALIZADO 
        ? OperacionAutoriaEnum.ELIMINACION 
        : OperacionAutoriaEnum.MODIFICACION;
      newAudit.idUsuario_actual = actividad.idUsuario_actual.idUsuarios;
      newAudit.idUsuario_modificacion = actividad.idUsuario_modificacion.idUsuarios;
      newAudit.idActividad = actividad.idActividades;
  
      const usuarioActual = await this.usuariosService.obtenerUsuarioPorId(newAudit.idUsuario_actual, EstadosUsuarioEnum.ACTIVO);
      const usuarioMod = await this.usuariosService.obtenerUsuarioPorId(newAudit.idUsuario_modificacion, EstadosUsuarioEnum.ACTIVO);
  
      if (!usuarioActual) {
        throw new NotFoundException(`El usuario con ID ${newAudit.idUsuario_actual} no existe.`);
      }
      if (!usuarioMod) {
        throw new NotFoundException(`El usuario con ID ${newAudit.idUsuario_modificacion} no existe.`);
      }
  
      await this.auditsService.createAudit(newAudit);
  
      return actividad;
    } catch (error) {
      console.error('Error en modificarActividad:', error);
      throw error;
    }
  }

  async eliminarActividad(eliminarActividad: EliminarActivityDto): Promise<Activity> {
    let queryRunner;
    try {
      queryRunner = this.entityManager.queryRunner;

      if (!queryRunner) {
        queryRunner = this.entityManager.connection.createQueryRunner();
      }

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const actividad = await this.actividadesRepo.findOne({ where: { idActividades: eliminarActividad.id } });

      if (!actividad) {
        throw new NotFoundException('Actividad no encontrada.');
      }

      await queryRunner.manager.delete('actividades_autoria', { idActividad: actividad.idActividades });

      await queryRunner.manager.delete(Activity, actividad.idActividades);

      await queryRunner.commitTransaction();

      return actividad;
    } catch (error) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      if (queryRunner && queryRunner.isConnected) {
        await queryRunner.release();
      }
    }
  }


  async getActividades(usuario: Usuario): Promise<Activity[]> {
    const rol: RolesEnum = usuario.rol;
  
    const consulta = this.actividadesRepo
    .createQueryBuilder('actividad')
    .leftJoinAndSelect('actividad.idUsuario_modificacion', 'usuario_modificacion')
    .leftJoinAndSelect('actividad.idUsuario_actual', 'usuario_actual');

  
    if (rol === RolesEnum.EJECUTOR) {
      consulta.where('actividad.estado = :estado', { estado: EstadosActividadEnum.PENDIENTE })
        .andWhere('usuario_modificacion.id = :idUsuario', { idUsuario: usuario.idUsuarios });
    }
    if (rol === RolesEnum.EJECUTOR) {
      consulta.where('actividad.estado = :estado', { estado: EstadosActividadEnum.PENDIENTE })
        .andWhere('usuario_actual.id = :idUsuario', { idUsuario: usuario.idUsuarios });
    }
  
    return await consulta.getMany();
  }
  

  async getActividadesByResponsibleUser(userId: number): Promise<Activity[]> {
    const consulta = this.actividadesRepo
      .createQueryBuilder('actividad')
      .innerJoin('actividad.idUsuario_actual', 'usuario')
      .where('usuario.idUsuarios = :idUsuario', {
        idUsuario: userId
      });
    return await consulta.getMany();
  }

  async getCompletedActividades(usuario: Usuario): Promise<Activity[]> {
    const rol: RolesEnum = usuario.rol;

    const consulta = this.actividadesRepo
      .createQueryBuilder('actividad')
      .innerJoin('actividad.responsibleUser', 'usuario')
      .where('actividad.estado = :estado', {
        estado: EstadosActividadEnum.FINALIZADO
      });

    if (rol === RolesEnum.EJECUTOR) {
      consulta.andWhere('usuario.idUsuarios = :idUsuario', {
        idUsuario: usuario.idUsuarios
      });
    }

    return await consulta.getMany();
  }

  async getPendingActividades(usuario: Usuario): Promise<Activity[]> {
    const rol: RolesEnum = usuario.rol;

    const consulta = this.actividadesRepo
      .createQueryBuilder('actividad')
      .innerJoin('actividad.responsibleUser', 'usuario')
      .where('actividad.estado = :estado', {
        estado: EstadosActividadEnum.PENDIENTE
      });

    if (rol === RolesEnum.EJECUTOR) {
      consulta.andWhere('usuario.idUsuarios = :idUsuario', {
        idUsuario: usuario.idUsuarios
      });
    }

    return await consulta.getMany();
  }

  async getErasedActividades(usuario: Usuario): Promise<Activity[]> {
    const rol: RolesEnum = usuario.rol;

    const consulta = this.actividadesRepo
      .createQueryBuilder('actividad')
      .innerJoin('actividad.responsibleUser', 'usuario')
      .where('actividad.estado = :estado', {
        estado: EstadosActividadEnum.ELIMINADO
      });

    if (rol === RolesEnum.EJECUTOR) {
      consulta.andWhere('usuario.idUsuarios = :idUsuario', {
        idUsuario: usuario.idUsuarios
      });
    }

    return await consulta.getMany();
  }

  async getActividadesByDescription(actividadDescripcion: string, usuario: Usuario) {
    const rol: RolesEnum = usuario.rol

    if (rol === RolesEnum.EJECUTOR) {
      const actividades: Activity[] = await this.actividadesRepo.find({
        where: {
          descripcion: Like(`%${actividadDescripcion}%`),
          idUsuario_actual: usuario
        }
      });

      return actividades;
    } else {
      const actividades: Activity[] = await this.actividadesRepo.find({
        where: {
          descripcion: Like(`%${actividadDescripcion}%`)
        }
      });

      return actividades;
    }
  }

  async getActividadesById(idActividades: number) {
    const actividades: Activity = await this.actividadesRepo.findOne({
      where: {
        idActividades: idActividades
      }
    });

    return actividades;
  }
}
