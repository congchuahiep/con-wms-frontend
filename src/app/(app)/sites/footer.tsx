"use client";

interface SitesFooterProps {
  total: number;
}

export function SitesFooter({ total }: SitesFooterProps) {
  return (
    <footer className="shrink-0 flex items-center justify-between border-t px-6 py-2">
      <p className="text-sm text-muted-foreground">{total} công trường</p>
    </footer>
  );
}
