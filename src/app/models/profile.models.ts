import { RoleModel } from "./roles.model";

export interface ProfileCreateRequest {
  name?: string;
  displayname?: string;
  roles: string[];
}

export interface ProfileUpdateRequest {
  name?: string;
  displayname?: string;
  roles: string[];
}

export interface ProfileResponse {
  id: number;
  name?: string;
  displayname?: string;
  roles: RoleModel[];
}
