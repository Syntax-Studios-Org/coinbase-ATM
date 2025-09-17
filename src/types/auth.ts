import type { User } from "@coinbase/cdp-hooks";

export interface AuthState {
  user: User | null;
  isNewUser: boolean | null;
  flowId: string | null;
  isAuthenticated: boolean;
}

export interface SignInRequest {
  email: string;
}

export interface SignInResponse {
  flowId: string;
}

export interface VerifyOTPRequest {
  flowId: string;
  otp: string;
}

export interface VerifyOTPResponse {
  user: User;
  isNewUser: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
}
