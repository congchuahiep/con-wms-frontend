/**
 * Format decimal (backend trả string) theo locale vi-VN.
 * null/undefined/rỗng → "-" (không phải 0, vì "không có giá" ≠ "0").
 */
export function formatDecimal(
  value: number | string | null | undefined,
  maxFractionDigits = 3,
): string {
  if (value === null || value === undefined || value === "") return "-";
  const number = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(number)) return String(value);
  return number.toLocaleString("vi-VN", {
    maximumFractionDigits: maxFractionDigits,
  });
}

/** "2026-08-13" → "13/08/2026" */
export function formatDate(date: string | null | undefined): string {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
}

/** ISO datetime → "08:30 13/08/2026" */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${time} ${date.toLocaleDateString("vi-VN")}`;
}
