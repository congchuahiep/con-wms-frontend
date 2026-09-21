"use client";

import type { OutboundNoteDetail } from "@/features/outbound-note";
import { cn } from "@/lib/utils";
import { formatDateTime, formatDecimal } from "@/utils/format";
import {
  PRINT_TD,
  PRINT_TD_CENTER,
  PRINT_TD_RIGHT,
  PRINT_TH,
  PrintDocHeader,
  PrintMetaGrid,
  PrintNote,
  PrintSignatures,
  PrintVoided,
} from "./print-sheet";

/** Chứng từ in: PHIẾU XUẤT KHO. */
export function OutboundPrintDocument({ note }: { note: OutboundNoteDetail }) {
  const purpose =
    note.noteType === "transfer"
      ? note.toWarehouse
        ? `Điều chuyển → ${note.toWarehouse.code} — ${note.toWarehouse.name}`
        : "Điều chuyển"
      : note.site
        ? `Cấp phát → ${note.site.code} — ${note.site.name}`
        : "Cấp phát";

  return (
    <div className="space-y-6">
      <PrintDocHeader
        eyebrow="Chứng từ kho"
        title="Phiếu xuất kho"
        number={note.number}
        date={note.date}
        rightExtra={
          <p className="text-[12px] text-neutral-500">{note.noteTypeLabel}</p>
        }
      />

      <PrintMetaGrid
        rows={[
          {
            label: "Kho xuất",
            value: `${note.warehouse.code} — ${note.warehouse.name}`,
          },
          { label: "Mục đích", value: purpose },
          { label: "Người lập", value: note.createdBy.email },
          { label: "Trạng thái", value: note.statusLabel },
        ]}
      />

      <table className="w-full border-collapse border-2 border-neutral-900">
        <thead>
          <tr>
            <th className={cn(PRINT_TH, "w-10 text-center")}>STT</th>
            <th className={PRINT_TH}>MVT</th>
            <th className={PRINT_TH}>Tên vật tư</th>
            <th className={cn(PRINT_TH, "w-24 text-right")}>Số lượng</th>
            <th className={PRINT_TH}>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {note.lines.map((line) => (
            <tr key={line.id ?? line.lineNo}>
              <td className={PRINT_TD_CENTER}>{line.lineNo}</td>
              <td className={PRINT_TD}>
                <code className="text-[10px]">{line.material.code}</code>
              </td>
              <td className={PRINT_TD}>{line.material.name}</td>
              <td className={PRINT_TD_RIGHT}>{formatDecimal(line.quantity)}</td>
              <td className={PRINT_TD}>{line.note || "—"}</td>
            </tr>
          ))}
          <tr className="border-t border-neutral-900">
            <td className={cn(PRINT_TD, "font-semibold")} colSpan={3}>
              Tổng cộng ({note.lines.length} dòng)
            </td>
            <td className={cn(PRINT_TD_RIGHT, "border-0")} />
            <td className={cn(PRINT_TD)} />
          </tr>
        </tbody>
      </table>

      <PrintNote label="Ghi chú" value={note.note} />

      {note.status === "voided" && (
        <PrintVoided
          reason={note.voidReason}
          by={note.voidedBy?.email ?? "—"}
          at={formatDateTime(note.voidedAt)}
        />
      )}

      <PrintSignatures
        roles={[
          { role: "Người lập phiếu", name: note.createdBy.email },
          { role: "Thủ kho" },
          { role: "Người nhận" },
        ]}
      />
    </div>
  );
}
