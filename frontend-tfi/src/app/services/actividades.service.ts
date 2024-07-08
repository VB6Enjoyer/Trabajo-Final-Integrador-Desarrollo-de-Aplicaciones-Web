import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ActividadDto } from '../dtos/actividad.dto';
import { CreateActividadDto } from '../dtos/create-actividad.dto';
import { EditActividadDto } from '../dtos/edit-actividad.dto';
import { environment } from '../../environments/environment';
import { AuditoriaDto } from '../dtos/auditoria.dto';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  constructor(private client: HttpClient) {}

  getActividades(): Observable<ActividadDto[]> {
    return this.client.get<ActividadDto[]>(
      environment?.apiUrl + '/actividades'
    );
  }


  getAuditoria(idActividades: number): Observable<AuditoriaDto[]> {
    return this.client.get<AuditoriaDto[]>(
      environment?.apiUrl + '/autoria/' + idActividades
    );
  }
  

  crear(actividadDto: CreateActividadDto): Observable<ActividadDto> {
    return this.client.post<ActividadDto>(
      environment?.apiUrl + '/actividades',
      actividadDto
    );
  }

  

  editar(idActividades: number, actividadDto: Omit<EditActividadDto, 'idActividades'>): Observable<ActividadDto> {
    console.log('Actividad a editar:', idActividades);
    console.log('Datos a enviar:', actividadDto); // Verificar que el id no esté incluido
    return this.client.put<ActividadDto>(
      `${environment?.apiUrl}/actividades/modificaractividad/${idActividades}`,
      actividadDto
    )
  }
}
