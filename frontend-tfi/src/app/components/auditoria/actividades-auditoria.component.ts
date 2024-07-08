import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuditoriaDto } from '../../dtos/auditoria.dto';
import { ActividadesAutoriaService } from '../../services/auditoria.service';
import { MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActividadesService } from '../../services/actividades.service';
import { TablaBaseComponent } from '../tabla-base/tabla-base.component';
import { ActividadDialogComponent } from '../actividad-dialog/actividad-dialog.component';
import { NgIf, NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BaseComponent } from '../base/base.component';
 
@Component({
  selector: 'app-actividades-auditoria',
  templateUrl: './actividades-auditoria.component.html',
  styleUrls: ['./actividades-auditoria.component.scss'],
  standalone: true,
  imports: [
    ActividadDialogComponent,
    ButtonModule,
    TooltipModule,
    ToastModule,
    NgIf,
    NgFor,
    RouterModule,
    TablaBaseComponent,
    TableModule,
    BaseComponent
  ]
})
export class ActividadesAuditoriaComponent implements OnInit {
  auditoriaDto!: AuditoriaDto[];
  dialogVisible: boolean = false;
  accion!: string;
  actividadSeleccionada!: AuditoriaDto | null;
  columnas!: { field: string; header: string; filter?: boolean }[];
  opcionesDeFiltro!: SelectItem[];
  idActividades_autoria!: string | null;

  constructor(
    private route: ActivatedRoute,
    private actividadesAuditoriaService: ActividadesAutoriaService,
    private messageService: MessageService,
    private router: Router,
    private actividadesService: ActividadesService
  ) {}

  ngOnInit() {
    this.columnas = [
      { field: 'idActividades_autoria', header: 'Id' },
      { field: 'descripcion', header: 'Descripción', filter: true },
      { field: 'prioridad', header: 'Prioridad' },
      { field: 'estado', header: 'Estado' },
      { field: 'operacion', header: 'Operación' }
    ];

    this.opcionesDeFiltro = [
      {
        value: 'startsWith',
        label: 'Empieza con',
      },
      {
        value: 'contains',
        label: 'Contiene',
      },
    ];

    this.route.paramMap.subscribe(params => {
      this.idActividades_autoria = params.get('id');
      console.log('ID from route:', this.idActividades_autoria);
      if (this.idActividades_autoria) {
        this.llenarTabla(parseInt(this.idActividades_autoria, 10));
      } else {
        this.actividadesService.getActividades().subscribe({
          next: (actividades) => {
            if (actividades.length > 0) {
              this.llenarTabla(actividades[0].idActividades); 
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'No se encontraron actividades',
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ocurrió un error al recuperar las actividades',
            });
          }
        });
      }
    });
  }

  llenarTabla(idActividades_autoria: number) {
    this.actividadesAuditoriaService.getAuditoria(idActividades_autoria).subscribe({
      next: (res) => {
        console.log('Response from service:', res); 
        this.auditoriaDto = res.map((actividadE: any) => ({
          idActividades_autoria: actividadE.idActividades_autoria,
          descripcion: actividadE.descripcion,
          prioridad: actividadE.prioridad,
          fecha_modificacion: actividadE.fecha_Modificacion, 
          estado: actividadE.estado,
          operacion: actividadE.operacion,
          idUsuario_actual: actividadE.idUsuario_actual,
          idActividad: actividadE.idActividad 
        }));
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Ocurrió un error al recuperar la lista de actividades',
        });
      },
    });
  }

  nuevo() {
    this.actividadSeleccionada = null;
    this.accion = 'Crear';
    this.dialogVisible = true;
  }

  editar() {
    this.accion = 'Editar';
    this.dialogVisible = true;
  }
}