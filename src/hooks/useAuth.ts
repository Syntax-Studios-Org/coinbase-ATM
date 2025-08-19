import { useState, useCallback } from "react";
import { useSignInWithEmail, useVerifyEmailOTP } from "@coinbase/cdp-hooks";
import type { SignInRequest, VerifyOTPRequest, AuthError } from "@/types/auth";

export const useSignIn = () => {
  const signInWithEmail = useSignInWithEmail();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signIn = useCallback(
    async ({ email }: SignInRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await signInWithEmail({ email });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Sign in failed");
        setError(error);
        console.error("Sign in failed:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [signInWithEmail],
  );

  return { signIn, isLoading, error };
};

export const useVerifyOTP = () => {
  const verifyEmailOtp = useVerifyEmailOTP();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const verifyOTP = useCallback(
    async ({ flowId, otp }: VerifyOTPRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await verifyEmailOtp({ flowId, otp });
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("OTP verification failed");
        setError(error);
        console.error("OTP verification failed:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [verifyEmailOtp],
  );

  return { verifyOTP, isLoading, error };
};
