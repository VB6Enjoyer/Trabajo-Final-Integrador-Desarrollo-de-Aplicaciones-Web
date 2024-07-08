import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { UsuarioDto } from '../../dtos/usuario.dto';
import { PrioridadesEnum } from '../../enums/prioridades.enum';
import { EstadosActividadEnum } from '../../enums/estados-actividad.enum';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ActividadesService } from '../../services/actividades.service';
import { ActividadDto } from '../../dtos/actividad.dto';
import { DropdownModule } from 'primeng/dropdown';
import { NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UsuariosService } from '../../services/usuarios.service';
import { EditActividadDto } from '../../dtos/edit-actividad.dto';

@Component({
  selector: 'app-actividad-dialog',
  standalone: true,
  imports: [
    DialogModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule,
    NgIf,
  ],
  templateUrl: './actividad-dialog.component.html',
  styleUrls: ['./actividad-dialog.component.scss'],
})
export class ActividadDialogComponent {
  @Input({ required: true }) visible!: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() refrescar = new EventEmitter<boolean>();

  @Input({ required: true }) accion!: string;

  @Input({ required: false }) actividad!: ActividadDto | null;

  usuarios!: UsuarioDto[];

  prioridades = Object.values(PrioridadesEnum);

  estados = Object.values(EstadosActividadEnum);

  form = new FormGroup({
    idActividades: new FormControl<number | null>(null),
    descripcion: new FormControl<string | null>(null, [Validators.required]),
    idUsuario_actual: new FormControl<UsuarioDto | null>(null, [
      Validators.required,
    ]),
    prioridad: new FormControl<PrioridadesEnum | null>(null, [
      Validators.required,
    ]),
    estado: new FormControl<EstadosActividadEnum | null>(null),
  });

  constructor(
    private actividadesService: ActividadesService,
    private usuariosService: UsuariosService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'secondary',
          summary: 'Hubo un error al recuperar las opciones de usuario',
        });
      },
    });
  }

  llenarForm() {
    if (this.actividad) {
      this.form.patchValue({
        idActividades: this.actividad.idActividades,
        descripcion: this.actividad.descripcion,
        prioridad: this.actividad.prioridad,
        estado: this.actividad.estado,
        idUsuario_actual: this.actividad.idUsuario_actual?.idUsuarios,
      });
    }
  }

  ngOnChanges() {
    if (this.actividad) {
      this.llenarForm();
    } else {
      this.form.reset();
    }
  }

  cerrar() {
    this.visibleChange.emit(false);
  }

  enviar() {
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario incompleto',
        detail: 'Debe ingresar todos los campos obligatorios',
      });
      return;
    }

    const { idActividades, ...actividadDto } = this.form.value as EditActividadDto;

    if (this.actividad) {
      this.actividadesService.editar(this.actividad.idActividades!, actividadDto).subscribe({
        next: (res) => {
          this.actividad = res;
          this.cerrar();
          this.refrescar.emit();
          this.messageService.add({
            severity: 'success',
            summary: 'Actividad editada',
            detail: 'La actividad se ha editado correctamente',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al editar actividad',
            detail: 'Ocurrió un error al intentar editar la actividad',
          });
        },
      });
    } else {
      this.actividadesService.crear({
        descripcion: actividadDto.descripcion!,
        prioridad: actividadDto.prioridad!,
        idUsuario_actual: actividadDto.idUsuario_actual!,
        estado: EstadosActividadEnum.PENDIENTE,
      }).subscribe({
        next: (res) => {
          this.cerrar();
          this.refrescar.emit();
          this.messageService.add({
            severity: 'success',
            summary: 'Actividad creada',
            detail: 'La actividad se ha creado correctamente',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear actividad',
            detail: 'Ocurrió un error al intentar crear la actividad',
          });
        },
      });
    }
  }
}