"use client";

import { ATMContainer } from "@/components/atm/ATMContainer";
import { LoadingSpinner } from "@/components/ui";
import { useIsInitialized } from "@coinbase/cdp-hooks";

export default function HomePage() {
  const isInitialized = useIsInitialized();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-white/60">Initializing...</p>
        </div>
      </div>
    );
  }

  return <ATMContainer />;
}
