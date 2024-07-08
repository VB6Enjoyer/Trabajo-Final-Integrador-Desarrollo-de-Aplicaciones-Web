import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActividadEjecutorDto } from '../dtos/actividadejecutor.dto';
import { CreateActividadDto } from '../dtos/create-actividad.dto';
import { EditActividadDto } from '../dtos/edit-actividad.dto';
import { environment } from '../../environments/environment';
import { AuditoriaDto } from '../dtos/auditoria.dto';

@Injectable({
  providedIn: 'root',
})
export class ActividadesEjecutorService {
  constructor(private client: HttpClient) {}

  getActividadesEjecutor(userId: number|null): Observable<ActividadEjecutorDto[]> {
    return this.client.get<ActividadEjecutorDto[]>(
      environment?.apiUrl + `/actividades/buscarPorUsuarioResponsable/${userId}`
    );
  }

  eliminar(idActividad: number){
    console.log(idActividad)
    return this.client.delete(
      environment?.apiUrl + '/actividades/' + idActividad,
    );
  }


  marcarfinalizada(idActividad: number) {
    console.log(idActividad)
    return this.client.put(
      environment?.apiUrl + '/actividades/marcarfinalizada/' + idActividad, {}
    );
  }

}