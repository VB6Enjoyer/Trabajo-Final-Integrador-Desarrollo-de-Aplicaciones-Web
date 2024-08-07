import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Table, TableModule } from 'primeng/table';
import { ActividadDto } from '../../dtos/actividad.dto';
import { ActividadesService } from '../../services/actividades.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ActividadDialogComponent } from '../actividad-dialog/actividad-dialog.component';
import { NgFor, NgIf } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';
import { TablaBaseComponent } from '../tabla-base/tabla-base.component';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-actividades-admin',
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
  ],
  templateUrl: './actividades-admin.component.html',
  styleUrl: './actividades-admin.component.scss',
})
export class ActividadesAdminComponent {
  actividades!: ActividadDto[];
  dialogVisible: boolean = false;
  accion!: string;
  actividadSeleccionada!: ActividadDto | null;
  columnas!: { field: string; header: string; filter?: boolean }[];
  opcionesDeFiltro!: SelectItem[];

  constructor(
    private actividadesService: ActividadesService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
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
      {
        value: 'startsWith',
        label: 'Empieza con',
      },
      {
        value: 'contains',
        label: 'Contiene',
      },
    ];
    this.llenarTabla();
  }
  

  llenarTabla() {
    this.actividadesService.getActividades().subscribe({
      next: (res) => {
        this.actividades = res.map(actividad => ({
          ...actividad,
          nombreUsuarioActual: actividad.idUsuario_actual ? actividad.idUsuario_actual.nombreUsuario : 'N/A',
          nombreUsuarioModificacion: actividad.idUsuario_modificacion ? actividad.idUsuario_modificacion.nombreUsuario : 'N/A'
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

  auditoria() {
    if (this.actividadSeleccionada) {
      this.router.navigateByUrl('/auditoria/' + this.actividadSeleccionada.idActividades);
      console.log(this.actividadSeleccionada.idActividades)
    }
  }
  crearUsuario() {
      this.router.navigateByUrl('/usuario');
    }
}