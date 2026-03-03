import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-url';
import { RoleModel } from '../models/roles.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly http = inject(HttpClient);

  getRolesPaged(
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

    return this.http.get<RoleModel[]>(
      `${API_BASE_URL}/roles`,
      {
        params,
        observe: 'response',
      }
    );
  }

  getAllRoles(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(`${API_BASE_URL}/roles`);
  }

  getRoleById(id: string): Observable<RoleModel> {
    return this.http.get<RoleModel>(`${API_BASE_URL}/roles/${id}`);
  }

  deleteRole(id: string) {
    return this.http.delete(`${API_BASE_URL}/roles/${id}`);
  }

  updateRole(user: RoleModel) {
    return this.http.put(`${API_BASE_URL}/roles/${user.id}`, user);
  }

  createRole(user: RoleModel): Observable<RoleModel> {
    return this.http.post<RoleModel>(`${API_BASE_URL}/roles`, user);
  }
}