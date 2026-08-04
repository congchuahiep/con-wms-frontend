"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "@/configs/env";

export function MapProvider({ children }: { children: React.ReactNode }) {
  return <APIProvider apiKey={env.GOOGLE_MAP_API}>{children}</APIProvider>;
}
