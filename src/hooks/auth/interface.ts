export interface LoginRequest {
  email: string;
  password: string;
  anonymous_id: string;
}

export interface LoginResponse {
  access_token: string;
}