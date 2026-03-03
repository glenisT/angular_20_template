export interface RoleCreateRequest {
    name: string;
    displayName: string;
    description: string;
    authorities: string[]
}

export interface RoleUpdateRequest {
    name: string;
    displayName: string;
    description: string;
    authorities: string[]
}

export interface RoleModel {
    id: string;
    name: string;
    description: string;
    permissions: string[];
}