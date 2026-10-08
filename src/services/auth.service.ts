import axios from 'axios';

export interface LoginPayload {
  username: string;
  password: string;
  captchaToken?: string;
}

export interface LoginResponse {
  success?: boolean;
  status?: string | number;
  message?: string;
  token?: string;
  access_token?: string;
  data?: {
    id?: string;
    username?: string;
    name?: string;
    nama?: string;
    email?: string;
    role?: string;
    token?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>('/api/login', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};
