import { Router, RouterModule, RouterState, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.components';
import { ActividadesAdminComponent } from './components/actividades-admin/actividades-admin.component';
import { adminGuard } from './guards/admin.guard';
import { ActividadesAuditoriaComponent } from './components/auditoria/actividades-auditoria.component';
import { NgModule } from '@angular/core';
import { ejecutorGuard } from './guards/ejecutor.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/actividades-admin/actividades-admin.component').then(
        (mod) => mod.ActividadesAdminComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'usuario',
    loadComponent: () =>
      import('./components/usuario/usuario.component').then(
        (mod) => mod.UsuarioComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'ejecutor/:id',
    loadComponent: () =>
      import('./components/actividades-ejecutor/actividades-ejecutor.component').then(
        (mod) => mod.ActividadesEjecutorComponent
      ),
    canActivate: [ejecutorGuard],
  },
  {
    path: 'auditoria/:id',
    loadComponent: () =>
      import('./components/auditoria/actividades-auditoria.component').then(
        (mod) => mod.ActividadesAuditoriaComponent
      ),    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
