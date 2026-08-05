import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MapProvider } from "@/providers/map-provider";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
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
      className={cn("h-full font-sans antialiased", inter.variable)}
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
