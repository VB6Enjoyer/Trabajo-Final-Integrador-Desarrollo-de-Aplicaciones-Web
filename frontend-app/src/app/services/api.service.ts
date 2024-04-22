import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activities`);
  }

  // Implement methods for other CRUD operations (create, update, delete)
}