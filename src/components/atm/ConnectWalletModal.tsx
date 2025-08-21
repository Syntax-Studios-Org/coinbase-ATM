"use client";

import { useState } from "react";
import { useSignIn, useVerifyOTP } from "@/hooks/useAuth";
import { Dialog, DialogContent, Input, Button } from "@/components/ui";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [flowId, setFlowId] = useState<string | null>(null);

  const { signIn } = useSignIn()
  const { verifyOTP } = useVerifyOTP();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const request = await signIn({ email });
      setFlowId(request.flowId);
      setStep("otp");
    } catch (error) {
      console.error("Failed to send OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    try {
      await verifyOTP({ flowId: flowId!, otp }); // Using email as flowId for now
      onClose();
      setStep("email");
      setEmail("");
      setOtp("");
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep("email");
    setEmail("");
    setOtp("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[360px] bg-gradient-to-r from-[#091408] to-[#050a07] border border-[#2bc87638] rounded-[20px] p-6">
        <div className="flex flex-col items-center gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-[#2bc876] rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4M4 6v12c0 1.1.9 2 2 2h14v-8M20 12a2 2 0 00-2-2H6"
                  stroke="#09172d"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <h2 className="text-[#2bc876] font-pixelify font-semibold text-xl text-center">
              {step === "email" ? "Connect Wallet" : "Verify Email"}
            </h2>
          </div>

          {/* Email Step */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-white/80 text-sm">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#141519] border-[#2bc87638] text-white placeholder:text-white/40"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={!email || isLoading}
                isLoading={isLoading}
                className="w-full bg-[#2bc876] hover:bg-[#25b369] text-[#09172d] font-pixelify font-semibold"
              >
                Send Verification Code
              </Button>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-white/80 text-sm">
                  Verification Code
                </label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-[#141519] border-[#2bc87638] text-white placeholder:text-white/40 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="text-white/60 text-xs text-center">
                  Check your email for the verification code
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={!otp || isLoading}
                  isLoading={isLoading}
                  className="w-full bg-[#2bc876] hover:bg-[#25b369] text-[#09172d] font-pixelify font-semibold"
                >
                  Verify & Connect
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("email")}
                  className="w-full border-[#2bc87638] text-[#2bc876] hover:bg-[#2bc87610]"
                >
                  Back to Email
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
