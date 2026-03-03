import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserModel } from '../models/users.model';
import { API_BASE_URL } from '../config/api-url';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  getUsersPaged(
    pageIndex: number,
    pageSize: number,
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ) {
    const params: any = {
      _page: pageIndex + 1, // Material paginator is 0-based
      _limit: pageSize,
    };

    if (sortField && sortDirection) {
      params._sort = sortField;
      params._order = sortDirection;
    }

    return this.http.get<UserModel[]>(
      `${API_BASE_URL}/users`,
      {
        params,
        observe: 'response',
      }
    );
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${API_BASE_URL}/users`);
  }

  geUserById(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${API_BASE_URL}/users/${id}`);
  }

  getUserByEmail(email: string): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${API_BASE_URL}/users?email=${email}`);
  }

  deleteUser(id: string) {
    return this.http.delete(`${API_BASE_URL}/users/${id}`);
  }

  updateUser(user: UserModel) {
    return this.http.put(`${API_BASE_URL}/users/${user.id}`, user);
  }

  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${API_BASE_URL}/users`, user);
  }
}