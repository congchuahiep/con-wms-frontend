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

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  onConfirm: () => Promise<void>;
  isPending?: boolean;
}

export function DeleteConfirmDialog({
  open: externalOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending,
}: DeleteConfirmDialogProps) {
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
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error && (
          <Alert>
            <div>
              {error.message}

              {error instanceof BlockProtectedError && (
                <div>
                  {error.blockedBy.map((blockedBy) => (
                    <li key={blockedBy} className="ml-4">{blockedBy}</li>
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
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Đang xoá..." : "Xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
