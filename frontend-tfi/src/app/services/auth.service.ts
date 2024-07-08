import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { RolesEnum } from '../enums/roles.enum';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userId: number | null = null;

  constructor(private client: HttpClient, private router: Router) {}

  login(nombreUsuario: string, clave: string): Observable<{ token: string }> {
    return this.client.post<{ token: string }>(environment.apiUrl + '/auth/login', {
      nombreUsuario,
      clave,
    }).pipe(
      tap(response => {
        this.setSession(response.token);
        this.setUserId(response.token);
      })
    );
  }

  public setSession(token: string) { 
    sessionStorage.setItem('token', token);
  }

  public setUserId(token: string) {
    const decodedToken = new JwtHelperService().decodeToken(token);
    this.userId = decodedToken.userId;
  }

  getUserId(): number | null {
    return this.userId;
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return false;
    }
    return !new JwtHelperService().isTokenExpired(token);
  }

  hasRole(rol: RolesEnum): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return false;
    }

    return new JwtHelperService().decodeToken(token).rol === rol;
  }
}
