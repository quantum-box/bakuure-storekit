"use client";

import { createClient } from "@bakuure/storekit-core";
import type { StorekitClient, StorekitConfig } from "@bakuure/storekit-core";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";

interface StorekitContextValue {
  client: StorekitClient;
  config: StorekitConfig;
}

const StorekitContext = createContext<StorekitContextValue | null>(null);

export interface StorekitProviderProps {
  config: StorekitConfig;
  children: ReactNode;
}

export function StorekitProvider({ config, children }: StorekitProviderProps) {
  const client = useMemo(() => createClient(config), [config]);
  const value = useMemo(() => ({ client, config }), [client, config]);

  return (
    <StorekitContext.Provider value={value}>
      {children}
    </StorekitContext.Provider>
  );
}

export function useStorekitClient(): StorekitClient {
  const ctx = useContext(StorekitContext);
  if (!ctx) {
    throw new Error("useStorekitClient must be used within <StorekitProvider>");
  }
  return ctx.client;
}

export function useStorekitConfig(): StorekitConfig {
  const ctx = useContext(StorekitContext);
  if (!ctx) {
    throw new Error("useStorekitConfig must be used within <StorekitProvider>");
  }
  return ctx.config;
}
