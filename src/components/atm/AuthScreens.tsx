"use client";

import { useState } from "react";
import { ATMButton } from "@/components/ui";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { validateEmail, validateOTP } from "@/utils/validation";
import { useSignIn, useVerifyOTP } from "@/hooks/useAuth";

export type AuthScreen = "signin" | "email" | "otp";

interface AuthScreensProps {
  authScreen: AuthScreen;
  setAuthScreen: (screen: AuthScreen) => void;
  email: string;
  setEmail: (email: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
}

export function AuthScreens({
  authScreen,
  setAuthScreen,
  email,
  setEmail,
  otp,
  setOtp,
}: AuthScreensProps) {
  const { getVar, theme } = useThemeStyles();
  const {
    signIn,
    error: signInError,
    isLoading: isSigningInLoading,
  } = useSignIn();
  const {
    verifyOTP,
    error: verifyOtpError,
    isLoading: isVerifyingOtp,
  } = useVerifyOTP();

  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flowId, setFlowId] = useState("");

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
  };

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    try {
      const { flowId, message } = await signIn({ email });
      setFlowId(flowId);
      setAuthScreen("otp");
    } catch (error) {
      console.error("Email verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setOtpError("");
    try {
      await verifyOTP({ flowId, otp });
    } catch (error) {
      setOtpError("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  switch (authScreen) {
    case "signin":
      return (
        <div
          className="w-full h-[434px] rounded-[20px] overflow-hidden relative p-[1px]"
          style={{
            background: theme.cardBorder,
          }}
        >
          <div
            className="w-full h-full rounded-[20px] relative flex flex-col items-center justify-center"
            style={{
              backgroundImage: "url(/login-bg-img.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              boxShadow: "2px #00000026 inset",
            }}
          >
            {/* Welcome Text */}
            <div className="flex-1 flex items-center justify-center">
              <h1
                className="font-pixelify font-semibold text-3xl text-center"
                style={{
                  color: getVar("success"),
                }}
              >
                Welcome to the ATM
              </h1>
            </div>

            {/* Bottom Button */}
            <div className="w-full px-6 pb-8">
              <ATMButton
                onClick={() => setAuthScreen("email")}
                showPanda={true}
              >
                Sign in
              </ATMButton>
            </div>
          </div>
        </div>
      );

    case "email":
      return (
        <div
          className="w-full h-[434px] rounded-[20px] overflow-hidden relative p-[1px]"
          style={{
            background: theme.cardBorder,
          }}
        >
          <div
            className="w-full h-full rounded-[20px] relative flex flex-col"
            style={{
              backgroundImage: "url(/login-bg-img.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              boxShadow: "0px 0px 14px 0px #00000026 inset",
            }}
          >
            {/* Header */}
            <div className="pt-8 px-6">
              <h2
                className="font-pixelify font-semibold text-xl text-left"
                style={{
                  color: getVar("success"),
                }}
              >
                Welcome!{"\n"}Enter your email to log in...
              </h2>
            </div>

            {/* Center Email Input */}
            <div className="flex-1 flex items-center justify-center px-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full py-3 transition-colors focus:outline-none text-center font-pixelify text-2xl"
                style={{
                  color: getVar("success"),
                }}
              />
            </div>

            {/* Bottom Button */}
            <div className="px-6 pb-8">
              <ATMButton
                onClick={handleVerifyEmail}
                disabled={!validateEmail(email)}
                isLoading={isLoading}
                showPanda={true}
              >
                Verify Email
              </ATMButton>
            </div>
          </div>
        </div>
      );

    case "otp":
      return (
        <div
          className="w-full h-[434px] rounded-[20px] overflow-hidden relative p-[1px]"
          style={{
            background: theme.cardBorder,
          }}
        >
          <div
            className="w-full h-full rounded-[20px] relative flex flex-col"
            style={{
              backgroundImage: "url(/login-bg-img.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              boxShadow: "0px 0px 14px 0px #00000026 inset",
            }}
          >
            {/* Header */}
            <div className="pt-8 px-6">
              <h2
                className="font-pixelify font-semibold text-xl text-left"
                style={{
                  color: getVar("success"),
                }}
              >
                We've sent an OTP to{"\n"}
                {maskEmail(email)}
              </h2>
            </div>

            {/* Center OTP Input */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                  setOtpError("");
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full py-3 focus:outline-none transition-colors text-center font-pixelify text-5xl tracking-widest"
                style={{
                  color: getVar("success"),
                }}
              />
              {otpError && (
                <p className="text-red-500 font-pixelify text-sm">{otpError}</p>
              )}
            </div>

            {/* Bottom Button */}
            <div className="px-6 pb-8">
              <ATMButton
                onClick={handleVerifyOTP}
                disabled={!validateOTP(otp)}
                isLoading={isLoading}
                showPanda={true}
              >
                Verify and connect
              </ATMButton>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
