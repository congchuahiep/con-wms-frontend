import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MapProvider } from "@/providers/map-provider";
import { QueryProvider } from "@/providers/query-provider";

const geist = Geist({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "con-wms",
  description: "Hệ thống quản lý vật tư",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        "h-full font-sans antialiased",
        geist.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <MapProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </MapProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
