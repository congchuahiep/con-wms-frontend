"use client";

import { PrinterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

/** Style áp cho trang in: A4 khổ dọc, không margin (tự quản padding trên tờ giấy). */
const PRINT_PAGE_STYLE = `@page { size: A4; margin: 0; }
html, body { margin: 0 !important; padding: 0 !important; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }`;

interface PrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Đang fetch dữ liệu phiếu — hiện spinner, chưa tự in. */
  isLoading?: boolean;
  /** Chứng từ cần in (render khi có dữ liệu). */
  children?: React.ReactNode;
}

/**
 * Dialog xem trước + in chứng từ A4 dựa trên `react-to-print`:
 * nội dung được clone sang iframe ẩn rồi in qua trình duyệt — không dính
 * layout/sidebar của app, hỗ trợ phân trang A4 chuẩn.
 */
export function PrintDialog({
  open,
  onOpenChange,
  title,
  isLoading = false,
  children,
}: PrintDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const autoPrintedRef = useRef(false);

  // Font thực tế của app (Geist qua next/font) được gán qua CSS var `--font-sans`
  // trên thẻ <html> — react-to-print KHÔNG copy thẻ <html> vào iframe in nên
  // `var(--font-sans)` không phân giải được ở bản in. Đọc giá trị đã phân giải
  // từ DOM và gán tường minh (inline style — được clone vào iframe) để bản in
  // dùng ĐÚNG font của bản xem trước.
  const [sheetFonts, setSheetFonts] = useState<{
    sans: string;
    mono: string;
  } | null>(null);

  useEffect(() => {
    const sans = getComputedStyle(document.body).fontFamily;
    const codeEl = document.querySelector("code");
    const mono = codeEl ? getComputedStyle(codeEl).fontFamily : "";
    setSheetFonts({ sans, mono });
  }, []);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: title,
    pageStyle: PRINT_PAGE_STYLE,
  });

  // Bấm "In phiếu" từ menu action → mở dialog rồi TỰ động in khi dữ liệu sẵn sàng.
  useEffect(() => {
    if (!open) {
      autoPrintedRef.current = false;
      return;
    }
    if (isLoading || autoPrintedRef.current) return;
    autoPrintedRef.current = true;
    const timer = setTimeout(() => handlePrint(), 350);
    return () => clearTimeout(timer);
  }, [open, isLoading, handlePrint]);

  const ready = !isLoading && children != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[min(92svh,900px)] w-[min(94vw,880px)] max-w-none flex-col gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 space-y-0 px-5 py-3">
          <div className="min-w-0">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Xem trước &amp; in chứng từ kho
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto bg-neutral-100 px-6 py-5">
          {!ready ? (
            <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              Đang tải phiếu...
            </div>
          ) : (
            <div
              ref={contentRef}
              style={
                {
                  fontFamily: sheetFonts?.sans,
                  ...(sheetFonts?.mono
                    ? { "--font-mono": sheetFonts.mono }
                    : {}),
                } as CSSProperties
              }
              className="mx-auto w-[210mm] min-h-[297mm] bg-white px-[12mm] py-[14mm] text-neutral-900 shadow-xl print:min-h-0 print:w-auto print:shadow-none"
            >
              {children}
            </div>
          )}
        </div>

        <DialogFooter showCloseButton={false} className="px-5 py-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handlePrint}>
            <HugeiconsIcon
              icon={PrinterIcon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            In phiếu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
