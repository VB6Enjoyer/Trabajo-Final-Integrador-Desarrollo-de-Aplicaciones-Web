import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioDto } from '../dtos/usuario.dto';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private client: HttpClient) {}

  getUsuarios(): Observable<UsuarioDto[]> {
    return this.client.get<UsuarioDto[]>(environment?.apiUrl + '/usuarios');
  }

  crear(createUsuario: CreateUsuarioDto): Observable<UsuarioDto> {
    return this.client.post<UsuarioDto>(
      environment?.apiUrl + '/usuarios',
      createUsuario
    );
  }

}