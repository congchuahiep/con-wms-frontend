"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type AppError, BlockProtectedError } from "@/errors";
import { classifyError } from "@/utils/classify-error";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive" | "outline";
  onConfirm: () => Promise<void>;
  isPending?: boolean;
}

/**
 * Dialog xác nhận generic (chốt phiếu, xóa, ...).
 * Tự quản lý animation: `onOpenChangeComplete` chỉ gọi `onOpenChange(false)`
 * sau khi animation đóng hoàn tất — không dùng setTimeout.
 */
export function ConfirmDialog({
  open: externalOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  confirmVariant = "default",
  onConfirm,
  isPending,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
      setError(null);
    }
  }, [externalOpen]);

  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm();
      setOpen(false);
    } catch (err: unknown) {
      setError(classifyError(err));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(next) => {
        if (!next) onOpenChange(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {error && (
          <Alert>
            <div>
              {error.message}

              {error instanceof BlockProtectedError && (
                <div>
                  {error.blockedBy.map((blockedBy) => (
                    <li key={blockedBy} className="ml-4">
                      {blockedBy}
                    </li>
                  ))}
                </div>
              )}
            </div>
          </Alert>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Đang xử lý..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
