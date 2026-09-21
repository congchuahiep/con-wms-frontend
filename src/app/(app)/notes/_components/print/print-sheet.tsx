"use client";

import { formatDate } from "@/utils/format";

/** Tên công ty in trên đầu mọi chứng từ. */
export const COMPANY_NAME =
  "CÔNG TY TNHH MỘT THÀNH VIÊN XÂY DỰNG DỊCH VỤ T VÀ B";

/** Class cell bảng chứng từ — kẻ lưới đóng khung, màu cố định in đúng mọi theme. */
export const PRINT_TH =
  "border border-neutral-300 bg-neutral-100 px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-700 whitespace-nowrap";
export const PRINT_TD =
  "border border-neutral-300 px-3 py-2 align-top text-[13px] text-neutral-900";
export const PRINT_TD_RIGHT =
  "border border-neutral-300 px-3 py-2 text-right text-[13px] tabular-nums text-neutral-900";
export const PRINT_TD_CENTER =
  "border border-neutral-300 px-3 py-2 text-center text-[13px] text-neutral-900";

/**
 * Đầu chứng từ: tên công ty + tên phiếu bên trái, số phiếu + ngày bên phải.
 * Viền dưới đậm phân cách với thân.
 */
export function PrintDocHeader({
  eyebrow,
  title,
  number,
  date,
  rightExtra,
}: {
  eyebrow: string;
  title: string;
  number: string;
  date: string;
  rightExtra?: React.ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-6 border-b-2 border-neutral-400 pb-4">
      <div className="min-w-0 space-y-1">
        <p className="text-[12px] font-bold uppercase tracking-wide text-neutral-900">
          {COMPANY_NAME}
        </p>
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-500">
          {eyebrow}
        </p>
        <h1 className="text-[26px] leading-tight font-bold uppercase tracking-wide text-neutral-900">
          {title}
        </h1>
      </div>
      <div className="shrink-0 space-y-1 text-right">
        <p className="text-[15px] font-semibold tabular-nums text-neutral-900">
          {number}
        </p>
        <p className="text-[12px] text-neutral-500">{formatDate(date)}</p>
        {rightExtra}
      </div>
    </header>
  );
}

/** Lưới thông tin: label nằm phía trên value. */
export function PrintMetaGrid({
  rows,
}: {
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
      {rows.map((row) => (
        <div key={row.label} className="min-w-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            {row.label}
          </dt>
          <dd className="mt-0.5 text-[14px] font-medium text-neutral-900 [overflow-wrap:anywhere]">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Nhãn ghi chú phiếu (dòng đầy đủ bên dưới bảng). */
export function PrintNote({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <p className="w-32 shrink-0 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="flex-1 text-[13px] text-neutral-900">{value || "—"}</p>
    </div>
  );
}

/** Thông báo phiếu đã hủy. */
export function PrintVoided({
  reason,
  by,
  at,
}: {
  reason: string;
  by: string;
  at: string;
}) {
  return (
    <div className="rounded-lg border-2 border-red-400 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
      Phiếu đã bị hủy: {reason || "—"} · bởi {by} · lúc {at}
    </div>
  );
}

/** Ba ô chữ ký cuối chứng từ. */
export function PrintSignatures({
  roles,
}: {
  roles: { role: string; name?: string }[];
}) {
  return (
    <footer className="mt-12 grid grid-cols-3 gap-6">
      {roles.map(({ role, name }) => (
        <div key={role} className="text-center">
          <p className="text-[13px] font-semibold text-neutral-900">{role}</p>
          <div className="h-20" />
          <p className="text-[13px] font-medium text-neutral-900">
            {name ?? ""}
          </p>
          <p className="mt-4 text-[11px] text-neutral-500">
            (Ký, ghi rõ họ tên)
          </p>
        </div>
      ))}
    </footer>
  );
}
