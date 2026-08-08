"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  onConfirm: () => void;
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

  useEffect(() => {
    if (externalOpen) setOpen(true);
  }, [externalOpen]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // Delay clean up cho animation đóng
      setTimeout(() => onOpenChange(false), 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              handleOpenChange(false);
            }}
            disabled={isPending}
          >
            {isPending ? "Đang xoá..." : "Xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
