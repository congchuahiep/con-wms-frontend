"use client";

import type { StocktakeNoteDetail } from "@/features/stocktake";
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

/** Chứng từ in: PHIẾU KIỂM KÊ. */
export function StocktakePrintDocument({
  note,
}: {
  note: StocktakeNoteDetail;
}) {
  return (
    <div className="space-y-6">
      <PrintDocHeader
        eyebrow="Chứng từ kho"
        title="Phiếu kiểm kê"
        number={note.number}
        date={note.date}
        rightExtra={
          <p className="text-[12px] text-neutral-500">{note.statusLabel}</p>
        }
      />

      <PrintMetaGrid
        rows={[
          {
            label: "Kho kiểm kê",
            value: `${note.warehouse.code} — ${note.warehouse.name}`,
          },
          { label: "Người lập", value: note.createdBy.email },
          { label: "Số dòng", value: String(note.lines.length) },
        ]}
      />

      <table className="w-full border-collapse border-2 border-neutral-900">
        <thead>
          <tr>
            <th className={cn(PRINT_TH, "w-10 text-center")}>STT</th>
            <th className={PRINT_TH}>MVT</th>
            <th className={PRINT_TH}>Tên vật tư</th>
            <th className={cn(PRINT_TH, "w-24 text-right")}>Chênh lệch</th>
            <th className={PRINT_TH}>Lý do</th>
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
              <td className={PRINT_TD_RIGHT}>
                {formatSignedDecimal(line.difference)}
              </td>
              <td className={PRINT_TD}>{line.reason || "—"}</td>
              <td className={PRINT_TD}>{line.note || "—"}</td>
            </tr>
          ))}
          <tr className="border-t border-neutral-900">
            <td className={cn(PRINT_TD, "font-semibold")} colSpan={3}>
              Tổng cộng ({note.lines.length} dòng)
            </td>
            <td className={cn(PRINT_TD_RIGHT, "border-0")} />
            <td className={cn(PRINT_TD, "border-0")} />
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
          { role: "Người kiểm kê", name: note.createdBy.email },
          { role: "Thủ kho" },
        ]}
      />
    </div>
  );
}

/** Chênh lệch có dấu: "0.000" → "0.000", "1.500" → "+1.500", "-5.000" giữ nguyên. */
function formatSignedDecimal(value: string): string {
  const number = Number(value);
  if (number > 0) return `+${formatDecimal(value)}`;
  return formatDecimal(value);
}
