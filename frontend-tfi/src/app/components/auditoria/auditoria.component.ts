import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditoriaDto } from '../../dtos/auditoria.dto';
import { AuditService } from '../../services/auditoria.service';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {
  auditoria: AuditoriaDto[] = [];
  idActividad: number | null = null;
  actividadSeleccionada: any; 
  columnas = [
    { field: 'idActividades_autoria', header: 'Id' },
    { field: 'descripcion', header: 'Descripción' },
    { field: 'prioridad', header: 'Prioridad' },
    { field: 'fecha_modificacion', header: 'Fecha de Modificación' },
    { field: 'estado', header: 'Estado' },
    { field: 'operacion', header: 'Operación' },
    { field: 'idUsuario_actual', header: 'Usuario Asignado' },
    { field: 'idUsuario_modificacion', header: 'Usuario Modificador' },
    { field: 'idActividad', header: 'ID de Actividad' },


  ]; 
  constructor(private route: ActivatedRoute, private auditService: AuditService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.idActividad = +id;

      this.auditService.getAudits(this.idActividad).subscribe({
        next: (res) => {
          this.auditoria = res;
        },
        error: (err) => {
          console.error('Error al obtener la auditoría:', err);
        }
      });
    } else {
      console.error('No se proporcionó un id de actividad válido.');
    }
  }
}
