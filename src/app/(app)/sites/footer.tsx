"use client";
export function SitesFooter({ total }: { total: number }) {
  return <footer className="shrink-0 border-t px-3 py-2 text-sm text-muted-foreground">Tổng {total} công trường</footer>;
}
