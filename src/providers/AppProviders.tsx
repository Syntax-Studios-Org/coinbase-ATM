"use client";

import { CDPHooksProvider } from "@coinbase/cdp-hooks";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { clientEnv } from "@/config/client.env";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const projectId = clientEnv.CDP_PROJECT_ID;

  return (
    <ThemeProvider>
      <QueryProvider>
        <CDPHooksProvider
          config={{
            projectId,
          }}
        >
          {children}
        </CDPHooksProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
