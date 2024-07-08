import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { Usuario } from "../entities/usuario.entity";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UsuariosService } from "./usuarios.service";

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService) {
    }

    async login(loginDto: LoginDto): Promise<{ token: string, id: number}> {

        const usuario: Usuario = await this.usuariosService.obtenerUsuarioPorNombreDeUsuario(loginDto.nombreUsuario);

        if (!usuario) {
            throw new BadRequestException("Nombre de usuario no válido.");
        }

        const claveCorrecta = await bcrypt.compare(
            loginDto.clave.trim(),
            usuario.clave.trim(),
        );

        if (!claveCorrecta) {
            throw new BadRequestException("Clave incorrecta");
        }

        const token: string = this.jwtService.sign({
            sub: usuario.idUsuarios,
            rol: usuario.rol,
            userId: usuario.idUsuarios
        });
        return { token, id: usuario.idUsuarios };

    }
} 