"use client";

import { Form, Field as FormField, reset } from "@formisch/react";
import { EqualSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast";
import { ValidationError } from "@/errors";
import {
  type UnitConversion,
  useUpdateConversion,
} from "@/features/unit-conversion";

interface EditConversionDialogProps {
  conversion: UnitConversion | null;
  onClose: () => void;
}

export function EditConversionDialog({
  conversion,
  onClose,
}: EditConversionDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (conversion) setOpen(true);
  }, [conversion]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent forceBackdrop>
        {conversion && (
          <EditConversionFormContent
            conversion={conversion}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EditConversionFormContentProps {
  conversion: UnitConversion;
  onClose: () => void;
}

function EditConversionFormContent({
  conversion,
  onClose,
}: EditConversionFormContentProps) {
  const { form, handleSubmit, isPending, isDirty, error } = useUpdateConversion(
    conversion.id,
    conversion.isReverse,
    {
      factor: conversion.factor,
    },
    {
      onSuccess: (data) => {
        toast.add({
          title: "Thành công",
          description: "Quy đổi đã được cập nhật",
        });
        reset(form, {
          initialInput: {
            factor: conversion.isReverse
              ? String(1 / Number.parseFloat(data.factor))
              : data.factor,
          },
        });
      },
    },
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sửa quy đổi</DialogTitle>
      </DialogHeader>

      <Form of={form} onSubmit={handleSubmit} className="space-y-4">
        {error && !(error instanceof ValidationError) && (
          <Alert>Lỗi: {error.message}</Alert>
        )}

        <FormField of={form} path={["factor"]}>
          {(field) => (
            <>
              <div className="flex gap-2 items-center">
                <InputGroup className="flex-1 pointer-events-none">
                  <InputGroupInput readOnly value="1" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>{conversion.fromUnit.code}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                <HugeiconsIcon icon={EqualSignIcon} className="size-4" />

                <InputGroup className="flex-2">
                  <InputGroupInput
                    {...field.props}
                    id={field.props.name}
                    autoFocus
                    value={
                      (field.input ?? "") as
                        | string
                        | number
                        | readonly string[]
                        | undefined
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>{conversion.toUnit.code}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </>
          )}
        </FormField>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={!isDirty || isPending}>
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </Form>
    </>
  );
}
