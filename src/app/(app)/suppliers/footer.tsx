"use client";

interface SuppliersFooterProps {
  total: number;
}

export function SuppliersFooter({ total }: SuppliersFooterProps) {
  return (
    <footer className="shrink-0 flex items-center justify-between border-t px-6 py-2">
      <p className="text-sm text-muted-foreground">{total} nhà cung cấp</p>
    </footer>
  );
}
