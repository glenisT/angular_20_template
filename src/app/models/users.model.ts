export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  profileId: number;
  enabled: boolean;
}

export interface UserUpdateRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  profileId: number;
  enabled: boolean;
}

export interface UserModel {
  name: string,
  surname: string,
  username: string,
  password: string,
  email: string,
  role: string[],
  id: string
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
