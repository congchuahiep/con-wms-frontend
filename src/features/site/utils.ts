import { normalizeDecimal } from "@/utils/format";
import type {
  RequirementsUpdateInput,
  Site,
  SiteInput,
  SiteRequirementRow,
  SiteStatus,
} from "./types";

export const SITE_STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "inactive", label: "Ngừng hoạt động" },
] as const;

export const SITE_STATUS_LABELS: Record<SiteStatus, string> = {
  active: "Đang hoạt động",
  completed: "Đã hoàn thành",
  inactive: "Ngừng hoạt động",
};

/** Màu badge trạng thái theo vòng đời công trường. */
export function siteStatusLabel(status: SiteStatus): string {
  return SITE_STATUS_LABELS[status] ?? status;
}

export function toSiteInput(site: Site): SiteInput {
  return {
    code: site.code,
    name: site.name,
    manager: site.manager,
    phone: site.phone,
    address: site.address,
    note: site.note,
  };
}

/** Chuyển bảng so sánh (GET requirements) → input cho dialog sửa định mức. */
export function toRequirementsInput(
  rows: SiteRequirementRow[],
): RequirementsUpdateInput {
  return {
    lines: rows
      .filter((row) => row.requiredQuantity !== null)
      .map((row) => ({
        materialId: row.material.id,
        quantity: normalizeDecimal(row.requiredQuantity),
        note: row.note ?? "",
      })),
  };
}

/** Trạng thái dòng so sánh → nhãn tiếng Việt. */
export function requirementStatusLabel(
  status: SiteRequirementRow["status"],
): string {
  switch (status) {
    case "sufficient":
      return "Đủ";
    case "insufficient":
      return "Thiếu";
    case "not_in_plan":
      return "Ngoài định mức";
  }
}
