"use client";

import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

/**
 * Nút "Xuất Excel" dùng chung — xuất dữ liệu bảng HIỆN TẠI (trang đang xem)
 * ra file .xlsx. Nhãn mặc định nói rõ "trang này" vì bảng phân trang chỉ
 * xuất đúng trang hiện tại.
 */
export function ExportButton({
  onClick,
  disabled = false,
  label = "Xuất Excel trang này",
}: ExportButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      <HugeiconsIcon
        icon={Download01Icon}
        strokeWidth={2}
        data-icon="inline-start"
      />
      {label}
    </Button>
  );
}
