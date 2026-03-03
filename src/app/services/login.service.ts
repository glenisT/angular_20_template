import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-url';
import { RestResponse } from '../models/rest-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly http = inject(HttpClient);

  login(username: string, password: string): Observable<RestResponse<{ token: string }>> {
    return this.http.post<RestResponse<{ token: string }>>(`${API_BASE_URL}/authenticate`, { username, password });
  }
}
