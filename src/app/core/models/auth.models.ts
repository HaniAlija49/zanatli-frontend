export interface User {
  id: number;
  email: string;
  roles: string[];
  activeRole: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  isClient: boolean;
  isContractor: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type LoginDto = LoginRequest;
export type RegisterDto = RegisterRequest; 