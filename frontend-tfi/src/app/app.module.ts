import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
// import { ActividadesAuditoriaComponent } from './components/auditoria/actividades-auditoria.component';
import { ActividadesEjecutorComponent } from './components/actividades-ejecutor/actividades-ejecutor.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    // ActividadesAuditoriaComponent,
    ActividadesEjecutorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule, 
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    ActividadesEjecutorComponent,
  ]
})
export class AppModule { }
