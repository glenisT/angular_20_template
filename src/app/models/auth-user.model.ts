export interface AuthUser {
  sub: string;
  firstName: string;
  lastName: string;
  authorities: string[];
}