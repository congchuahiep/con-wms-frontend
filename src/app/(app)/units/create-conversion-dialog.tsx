"use client";

import { Form, getErrors } from "@formisch/react";
import { Add01Icon, EqualSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ValidationError } from "@/errors";
import { type Unit, useGetUnits } from "@/features/unit";
import { useAddConversion } from "@/features/unit-conversion";

interface CreateConversionDialogProps {
  unit: Unit;
}

export function CreateConversionDialog({ unit }: CreateConversionDialogProps) {
  const formId = `create-conversion-form-${unit.id}`;

  const [open, setOpen] = useState(false);
  const { data: units = [] } = useGetUnits();

  const toUnitOptions = useMemo(
    () =>
      units
        .filter((u) => u.id !== unit.id)
        .map((u) => ({ value: String(u.id), label: `${u.name}` })),
    [units, unit],
  );

  const { form, handleSubmit, isPending, resetForm, error } = useAddConversion(
    unit.id,
    {
      onSuccess: () => setOpen(false),
    },
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) resetForm();
      }}
    >
      <DialogTrigger
        render={() => (
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => setOpen(true)}
          >
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Thêm quy đổi
          </Button>
        )}
      ></DialogTrigger>
      <DialogContent forceBackdrop>
        <DialogHeader>
          <DialogTitle>Thêm quy đổi cho đơn vị "{unit.name}"</DialogTitle>
        </DialogHeader>

        <Form
          id={formId}
          of={form}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && !(error instanceof ValidationError) && (
            <Alert>Lỗi: {error.message}</Alert>
          )}

          <div className="flex gap-2 items-center">
            <InputGroup className="flex-1 pointer-events-none">
              <InputGroupInput readOnly value="1" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{unit.code}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>

            <HugeiconsIcon icon={EqualSignIcon} className="size-4" />

            <ButtonGroup className="flex-4">
              <InputField of={form} path={["factor"]} noField />

              <SelectField
                of={form}
                path={["toUnitId"]}
                options={toUnitOptions}
                transform={(v) => (v === "" ? null : Number(v))}
                placeholder="Chọn quy đổi"
                triggerClassName="w-32"
                noField
              />
            </ButtonGroup>
          </div>

          <FieldError
            errors={getErrors(form, { path: ["factor"] })?.map((message) => ({
              message,
            }))}
          />

          <FieldError
            errors={getErrors(form, { path: ["toUnitId"] })?.map((message) => ({
              message,
            }))}
          />

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>

            <Button form={formId} type="submit" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Thêm quy đổi"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
