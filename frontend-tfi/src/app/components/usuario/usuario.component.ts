import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { UsuarioCrearDto } from '../../dtos/usuariocrear.dto';
import { UsuarioDto } from '../../dtos/usuario.dto';
import { EstadosUsuarioEnum } from '../../enums/estados-usuario.enum';
import { RolesEnum } from '../../enums/roles.enum';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ActividadesService } from '../../services/actividades.service';
import { DropdownModule } from 'primeng/dropdown';
import { NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UsuariosService } from '../../services/usuarios.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    DialogModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule,
    NgIf,
    InputTextModule,
    PasswordModule,
    RouterOutlet
  ],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent {
  @Input({ required: true }) visible!: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() refrescar = new EventEmitter<boolean>();

  @Input({ required: true }) accion!: string;

  @Input({ required: false }) usuario!: UsuarioDto | null;

  roles = Object.values(RolesEnum);

  estado = Object.values(EstadosUsuarioEnum);

  form = new FormGroup({
    nombre: new FormControl<string | null>(null, [Validators.required]),
    apellido: new FormControl<string | null>(null, [Validators.required]),
    nombreUsuario: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required]),
    rol: new FormControl<RolesEnum | null>(null, [Validators.required]),
    estado: new FormControl<EstadosUsuarioEnum | null>(null, [Validators.required]),
  });

  usuarios!: UsuarioDto[];

  constructor(
    private actividadesService: ActividadesService,
    private usuariosService: UsuariosService,
    private messageService: MessageService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hubo un error al recuperar las opciones de usuario',
        });
      },
    });
  }

  llenarForm() {
    this.form.patchValue({
      email: this.usuario?.email ?? '',
      password: this.usuario?.password ?? '',
      apellido: this.usuario?.apellido ?? '',
      nombre: this.usuario?.nombre ?? '',
      estado: this.usuario?.estado ?? EstadosUsuarioEnum.ACTIVO,
      nombreUsuario: this.usuario?.nombreUsuario ?? '',
      rol: this.usuario?.rol ?? RolesEnum.EJECUTOR,
    });
  }

  ngOnChanges() {
    if (this.usuario) {
      this.llenarForm();
    } else {
      this.form.reset();
    }
  }
  administradorpad() {
    console.log("hola")
    this.router.navigateByUrl('/admin');
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


    const formValues = this.form.getRawValue();

    const usuarioDto: UsuarioCrearDto = {
      email: formValues.email || '',
      password: formValues.password || '',
      apellido: formValues.apellido || '',
      nombre: formValues.nombre || '',
      estado: formValues.estado || EstadosUsuarioEnum.ACTIVO,
      username: formValues.nombreUsuario || '',
      rol: formValues.rol || RolesEnum.EJECUTOR,
      idUsuarios: undefined,
    };

    this.usuariosService.crear(usuarioDto).subscribe({
      next: () => {
        this.cerrar();
        this.refrescar.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario creado',
          detail: 'El usuario se ha creado correctamente',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear usuario',
          detail: 'Ocurrió un error al intentar crear el usuario',
        });
      },
    });
  }
}
