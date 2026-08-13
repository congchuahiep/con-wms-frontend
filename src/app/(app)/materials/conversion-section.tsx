"use client";

import { FieldArray, type FormStore, insert, remove } from "@formisch/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { FieldError } from "@/components/ui/field";
import type { MaterialSchema } from "@/features/material";
import { type Unit, useGetUnits } from "@/features/unit";

interface MaterialConversionSectionProps {
  form: FormStore<typeof MaterialSchema>;
  unit: Unit;
  disabled?: boolean;
}

/**
 * Section quy đổi theo vật tư trong form Material.
 * Chỉ render khi `unit.conversionType === "material"`.
 */
export function MaterialConversionSection({
  form,
  unit,
  disabled = false,
}: MaterialConversionSectionProps) {
  const { data: units = [] } = useGetUnits();

  const toUnitOptions = useMemo(
    () =>
      units
        .filter((u) => u.id !== unit.id)
        .map((u) => ({ value: String(u.id), label: `${u.code} - ${u.name}` })),
    [units, unit.id],
  );

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Quy đổi theo vật tư</h4>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={() =>
            insert(form, {
              path: ["conversions"],
              initialInput: { toUnitId: null, factor: "1" },
            })
          }
        >
          <HugeiconsIcon
            icon={Add01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Thêm quy đổi
        </Button>
      </div>

      <FieldArray of={form} path={["conversions"]}>
        {(fieldArray) => (
          <div className="space-y-2">
            {fieldArray.items.map((item, index) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">
                  1 {unit.code} =
                </span>

                <ButtonGroup>
                  <InputField
                    of={form}
                    path={["conversions", index, "factor"]}
                    placeholder="Hệ số"
                    inputClassName="w-24"
                    noField
                  />

                  <SelectField
                    of={form}
                    path={["conversions", index, "toUnitId"]}
                    options={toUnitOptions}
                    transform={(v) => (v === "" ? null : Number(v))}
                    placeholder="Chọn đơn vị"
                    triggerClassName="w-36"
                    noField
                  />
                </ButtonGroup>

                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() =>
                    remove(form, { path: ["conversions"], at: index })
                  }
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    strokeWidth={2}
                    className="size-4 text-destructive"
                  />
                </Button>
              </div>
            ))}

            {fieldArray.items.length === 0 && (
              <p className="text-muted-foreground text-sm py-2">
                Chưa có quy đổi nào
              </p>
            )}

            {fieldArray.errors && (
              <FieldError
                errors={fieldArray.errors.map((message) => ({ message }))}
              />
            )}
          </div>
        )}
      </FieldArray>
    </div>
  );
}
