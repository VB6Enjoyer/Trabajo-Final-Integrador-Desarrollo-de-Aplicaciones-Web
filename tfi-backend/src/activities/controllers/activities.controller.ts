import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { ActividadesService } from '../services/activities.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { ModificarActivityDto } from '../dto/modificar-activity.dto';
import { EliminarActivityDto } from '../dto/eliminar-actividad';
import { Activity } from '../entities/activity.entity';

@Controller('/actividades')
export class ActividadesController {
  constructor(private actividadesService: ActividadesService) { }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Post()
  async crearActividad(@Body() crearActividadDto: CreateActivityDto, @Req() req: Usuario) {
    crearActividadDto.idUsuario_modificacion = req['usuario'];

    await this.actividadesService.crearActividad(crearActividadDto);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR, RolesEnum.EJECUTOR])
  @UseGuards(AuthGuard)
  @Put('modificaractividad/:id')
  async modificarActividad(
    @Param('id') id,
    @Body() modificarActividadDto: ModificarActivityDto,
    @Req() req: Usuario
  ) {
    modificarActividadDto.idActividades = id
    modificarActividadDto.idUsuario_modificacion = req['usuario'];

    return await this.actividadesService.modificarActividad(modificarActividadDto);
  };


  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR, RolesEnum.EJECUTOR])
  @UseGuards(AuthGuard)
  @Put('marcarfinalizada/:id')
  async marcarfinalizada(
    @Param('id') id,
    @Body() modificarActividadDto: ModificarActivityDto,
    @Req() req: Usuario
  ) {
    modificarActividadDto.idActividades = id
    modificarActividadDto.idUsuario_modificacion = req['usuario'];

    return await this.actividadesService.marcarfinalizada(modificarActividadDto);
  };

  @ApiBearerAuth()
  @Roles([RolesEnum.EJECUTOR])
  @UseGuards(AuthGuard)
  @Delete(':id')
  async eliminarActividad(
    @Param('id') id: number,
    @Body() eliminarActividad: EliminarActivityDto,
  ) {
    eliminarActividad.id = id;

    return await this.actividadesService.eliminarActividad(eliminarActividad);
  };

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR, RolesEnum.EJECUTOR])
  @UseGuards(AuthGuard)
  @Get()
  async getActividades(@Req() req: Usuario) {
    req = req['usuario'];

    return await this.actividadesService.getActividades(req);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  //@UseGuards(AuthGuard)
  @Get("buscarPorUsuarioResponsable/:id")
  async getActividadesByResponsibleUser(@Param('id') userId: number) {
    return await this.actividadesService.getActividadesByResponsibleUser(userId);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR, RolesEnum.EJECUTOR])
  @UseGuards(AuthGuard)
  @Get("buscarActividadesCompletas")
  async getCompletedActividades(@Req() req: Usuario) {
    const usuario = req['usuario'];

    return await this.actividadesService.getCompletedActividades(usuario);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR, RolesEnum.EJECUTOR])
  @UseGuards(AuthGuard)
  @Get("buscarActividadesPendientes")
  async getPendingActividades(@Req() req: Usuario) {
    const usuario = req['usuario'];

    return await this.actividadesService.getPendingActividades(usuario);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR, RolesEnum.EJECUTOR])
  @UseGuards(AuthGuard)
  @Get("buscarActividadesEliminadas")
  async getErasedActividades(@Req() req: Usuario) {
    const usuario = req['usuario'];

    return await this.actividadesService.getErasedActividades(usuario);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR, RolesEnum.EJECUTOR])
  @UseGuards(AuthGuard)
  @Get("buscarActividadesPorDescripcion")
  async getActividadesByDescription(@Query('actividadDescripcion') descripcion: string, @Req() req: Usuario): Promise<Activity[]> {
    const usuario = req['usuario'];

    return await this.actividadesService.getActividadesByDescription(descripcion, usuario);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Get("buscarActividadesPorId/:id")
  async getActividadesById(@Param('id') id: number): Promise<Activity> {
    return await this.actividadesService.getActividadesById(id);
  }
}