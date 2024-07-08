import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActividadesEjecutorService } from '../../services/actividadesejecutor.service';
import { ActividadEjecutorDto } from '../../dtos/actividadejecutor.dto';
import { TablaBaseComponent } from '../tabla-base/tabla-base.component';
import { ButtonModule } from 'primeng/button';
import { NgIf, NgFor } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ActividadDialogComponent } from '../actividad-dialog/actividad-dialog.component';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-actividades-ejecutor',
  templateUrl: './actividades-ejecutor.component.html',
  styleUrls: ['./actividades-ejecutor.component.scss'],
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
export class ActividadesEjecutorComponent implements OnInit {
  actividadesEjecutor: ActividadEjecutorDto[] = [];
  dialogVisible = false;
  accion: string | undefined;
  actividadSeleccionada: ActividadEjecutorDto | undefined;
  columnas: { field: string; header: string; filter?: boolean }[] = [];
  opcionesDeFiltro: SelectItem[] = [];
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private actividadesEjecutorService: ActividadesEjecutorService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.columnas = [
      { field: 'idActividades', header: 'Id' },
      { field: 'descripcion', header: 'Descripción', filter: true },
      { field: 'prioridad', header: 'Prioridad' },
      { field: 'fecha_modificacion', header: 'Fecha de Modificación' },
      { field: 'estado', header: 'Estado' },
      { field: 'nombreUsuarioActual', header: 'Responsable' },
      { field: 'nombreUsuarioModificacion', header: 'Usuario Modificador' },
    ];

    this.opcionesDeFiltro = [
      { value: 'startsWith', label: 'Empieza con' },
      { value: 'contains', label: 'Contiene' },
    ];

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('ID from route:', this.id);
      this.llenarTabla(); 
    });
  }

  llenarTabla(): void {
    const userId = this.id ? parseInt(this.id, 10) : this.authService.getUserId(); 
    if (userId) {
      this.actividadesEjecutorService.getActividadesEjecutor(userId).subscribe({
        next: (res: ActividadEjecutorDto[]) => {
          this.actividadesEjecutor = res.map(actividadE => ({
            ...actividadE,
            nombreUsuarioActual: actividadE.idUsuario_actual ? actividadE.idUsuario_actual.nombreUsuario : 'N/A',
          }));
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error al recuperar la lista de actividades',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'No se pudo obtener el ID del usuario',
      });
    }
  }

  nuevo(): void {
    this.actividadSeleccionada = undefined;
    this.accion = 'Crear';
    this.dialogVisible = true;
  }

  marcarfinalizado(): void {
    console.log('Intentando marcar actividad como "FINALIZADA"...');
    if (this.actividadSeleccionada) {
      this.actividadesEjecutorService.marcarfinalizada(this.actividadSeleccionada.idActividades).subscribe(
        () => {
          console.log('Actividad marcada como "FINALIZADA" correctamente');
          this.actividadesEjecutor = this.actividadesEjecutor.filter(a => a !== this.actividadSeleccionada);
          this.actividadSeleccionada = undefined;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Actividad marcada como "FINALIZADA" correctamente'
          });
        },
        (error) => {
          console.error('Error al marcar la actividad como "FINALIZADA"', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al marcar la actividad como "FINALIZADA"'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione una actividad para marcar como "FINALIZADA"'
      });
    }
  }

  eliminar(): void {
    console.log('Intentando eliminar actividad...');
    if (this.actividadSeleccionada) {
      this.actividadesEjecutorService.eliminar(this.actividadSeleccionada.idActividades).subscribe(
        () => {
          console.log('Actividad eliminada correctamente');
          this.actividadesEjecutor = this.actividadesEjecutor.filter(a => a !== this.actividadSeleccionada);
          this.actividadSeleccionada = undefined;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Actividad eliminada correctamente'
          });
        },
        (error) => {
          console.error('Error al eliminar actividad', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la actividad'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione una actividad para eliminar'
      });
    }
  }
}
