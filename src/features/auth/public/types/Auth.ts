import type { Customer } from '@/features/customer/profile/types/Profile';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: Customer;
    token: string;
  };
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
