import { VALIDATION_CONFIG } from "@/constants/config";

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  return VALIDATION_CONFIG.emailRegex.test(email.trim());
};

export const validateOTP = (otp: string): boolean => {
  if (!otp || typeof otp !== "string") return false;
  const cleanOtp = otp.replace(/\s/g, "");
  return (
    cleanOtp.length === VALIDATION_CONFIG.otpLength && /^\d+$/.test(cleanOtp)
  );
};

export const sanitizeInput = (input: string): string => {
  return input.trim().toLowerCase();
};

export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};
