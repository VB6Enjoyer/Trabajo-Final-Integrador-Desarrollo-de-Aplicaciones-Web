import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActividadesAuditoriaComponent } from '../components/auditoria/actividades-auditoria.component';

@Injectable({
  providedIn: 'root'
})
export class ActividadesAutoriaService {
  constructor(private client: HttpClient) {}

  getAuditoria(id: number|null): Observable<ActividadesAuditoriaComponent[]> {
    return this.client.get<ActividadesAuditoriaComponent[]>(
      environment?.apiUrl + `/auditoria/${id}`
    );
  }
}
