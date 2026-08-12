"use client";

import {
  Field as FormField,
  type FormSchema,
  type FormStore,
  type RequiredPath,
  type ValidPath,
} from "@formisch/react";
import { useMemo } from "react";
import type * as v from "valibot";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUnits } from "./services";
import type { Unit } from "./types";

type UnitSelectFieldProps<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
> = {
  of: FormStore<TSchema>;
  path: ValidPath<v.InferInput<TSchema>, TFieldPath>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

const GROUP_LABELS: Record<string, string> = {
  global: "Toàn cục",
  material: "Theo vật tư",
};

const EMPTY_VALUE = "__empty__";

function groupUnits(units: Unit[]): Record<string, Unit[]> {
  return units.reduce<Record<string, Unit[]>>((acc, unit) => {
    const type = unit.conversionType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(unit);
    return acc;
  }, {});
}

export function UnitSelectField<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
>(props: UnitSelectFieldProps<TSchema, TFieldPath>) {
  const {
    of,
    path,
    label,
    placeholder = "Chọn đơn vị tính",
    disabled,
    required,
    className,
  } = props;

  const { data: units = [] } = useGetUnits();

  const groups = useMemo(() => groupUnits(units), [units]);
  const groupOrder = useMemo(
    () => Object.keys(groups).sort((a, b) => a.localeCompare(b)),
    [groups],
  );

  return (
    <FormField of={of} path={path}>
      {(field) => {
        const selectValue =
          field.input === null || field.input === undefined
            ? EMPTY_VALUE
            : String(field.input);

        const handleValueChange = (next: string | null) => {
          if (next === null || next === EMPTY_VALUE) {
            if (required) return;
            field.onChange(null as unknown as never);
            return;
          }
          field.onChange(Number(next) as never);
        };

        const selectedUnit = units.find((u) => String(u.id) === selectValue);

        return (
          <Field
            data-invalid={field.errors ? true : undefined}
            className={className}
          >
            {label && (
              <FieldLabel>
                {label} {required && <span className="text-red-500">*</span>}
              </FieldLabel>
            )}
            <Select value={selectValue} onValueChange={handleValueChange}>
              <SelectTrigger
                disabled={disabled}
                name={field.props.name}
                autoFocus={field.props.autoFocus}
                aria-invalid={field.errors ? true : undefined}
              >
                <SelectValue placeholder={placeholder}>
                  {selectedUnit
                    ? `${selectedUnit.code} - ${selectedUnit.name}`
                    : placeholder}
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {!required && (
                  <SelectItem value={EMPTY_VALUE}>{placeholder}</SelectItem>
                )}
                {groupOrder.map((type) => (
                  <SelectGroup key={type}>
                    <SelectLabel>
                      {GROUP_LABELS[type] ?? type}
                    </SelectLabel>
                    {groups[type].map((unit) => (
                      <SelectItem key={unit.id} value={String(unit.id)}>
                        {unit.code} - {unit.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {field.errors && (
              <FieldError
                errors={field.errors.map((message) => ({ message }))}
              />
            )}
          </Field>
        );
      }}
    </FormField>
  );
}
