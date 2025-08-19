"use client";

import { CDPHooksProvider } from "@coinbase/cdp-hooks";
import { QueryProvider } from "./QueryProvider";
import { clientEnv } from "@/config/client.env";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const projectId = clientEnv.CDP_PROJECT_ID;

  return (
    <QueryProvider>
      <CDPHooksProvider
        config={{
          projectId,
        }}
      >
        {children}
      </CDPHooksProvider>
    </QueryProvider>
  );
}
