import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsuariosService } from '../servicies/usuarios.service';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enums/roles.enum';
import { AuthGuard } from '../guards/auth.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Usuario } from '../entities/usuario.entity';
import { EstadosUsuarioEnum } from '../enums/estado-usuario.enum';
import { ModifyUserDto } from '../dtos/modify-user.dto';

@Controller('/usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) { }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Post()
  async createUsuarios(@Body() crearUsuarioDto: CreateUserDto) {
    await this.usuariosService.crearUsuario(crearUsuarioDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  async getUsuarios() {
    return await this.usuariosService.obtenerUsuarios();
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Get('buscarPorNombreDeUsuario')
  async getUserByUsername(@Query('nombreUsuario') nombreUsuario: string): Promise<Usuario> {
    return await this.usuariosService.obtenerUsuarioPorNombreDeUsuario(nombreUsuario);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Get('buscarPorNombreDeUsuarioSimilar')
  async getUserListByUsername(@Query('nombreUsuario') nombreUsuario: string): Promise<Usuario[]> {
    return await this.usuariosService.obtenerListaDeUsuariosPorNombreDeUsuario(nombreUsuario);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Get('buscarPorNombreCompleto')
  async getUserListByName(@Query('nombreCompleto') nombreCompleto: string): Promise<Usuario[]> {
    return await this.usuariosService.obtenerListaDeUsuariosPorNombreCompleto(nombreCompleto);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Get('buscarPorRol')
  async getUserListByRole(@Query('userRole') role: RolesEnum): Promise<Usuario[]> {
    return await this.usuariosService.obtenerListaDeUsuariosPorRol(role);
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Get('buscarUsuariosInactivos')
  async getInactiveUsers(): Promise<Usuario[]> {
    return await this.usuariosService.obtenerListaDeUsuariosInactivos();
  }

  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  @Get('buscarPorId')
  async getUserById(@Query('id') userId: number): Promise<Usuario> {
    return await this.usuariosService.obtenerUsuarioPorId(userId, EstadosUsuarioEnum.ACTIVO);
  }

  @Put('modificarUsuario')
  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  async modifyUser(@Query('id') userId: number, @Body() modificarUsuarioDto: ModifyUserDto): Promise<void> {
    await this.usuariosService.modificarUsuario(userId, modificarUsuarioDto);
  }

  @Delete('eliminarUsuario')
  @ApiBearerAuth()
  @Roles([RolesEnum.ADMINISTRADOR])
  @UseGuards(AuthGuard)
  async deleteUser(@Query('id') userId: string): Promise<void> {
    const parsedUserId = parseInt(userId, 10);

    await this.usuariosService.eliminarUsuario(parsedUserId);
  }
} 