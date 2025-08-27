"use client";

import React from "react";
import { cn } from "@/utils/cn";
import Image from "next/image";

interface ATMButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showPanda?: boolean;
  isLoading?: boolean;
}

export const ATMButton = React.forwardRef<HTMLButtonElement, ATMButtonProps>(
  ({ children, showPanda = false, disabled, isLoading, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <button
          ref={ref}
          disabled={disabled || isLoading}
          className={cn(
            "w-full h-[44px] relative disabled:opacity-50 transition-opacity",
            "bg-center bg-no-repeat z-10 cursor-pointer",
            className
          )}
          style={{
            backgroundImage: 'url(/button-bg.svg)',
          }}
          {...props}
        >
          <div className="flex items-center justify-center w-full h-full px-6">
            <span className="font-pixelify font-semibold text-lg text-black">
              {isLoading ? "Loading..." : children}
            </span>
          </div>
        </button>

        {showPanda && (
          <div className="absolute right-9 -top-5 -translate-y-1/2 translate-x-1/2 z-5">
            <Image
              src="/panda.svg"
              alt="Panda"
              width={90}
              height={90}
            />
          </div>
        )}
      </div>
    );
  }
);

ATMButton.displayName = "ATMButton";
