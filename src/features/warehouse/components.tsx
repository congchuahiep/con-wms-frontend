"use client";

import type {
  FormSchema,
  FormStore,
  PathValue,
  RequiredPath,
  ValidPath,
} from "@formisch/react";
import type * as v from "valibot";
import { SelectField } from "@/components/form/SelectField";
import { useGetWarehouses } from "./services";

type WarehouseSelectFieldProps<
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

/** Select kho — options từ `useGetWarehouses` (không phân trang). */
export function WarehouseSelectField<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
>(props: WarehouseSelectFieldProps<TSchema, TFieldPath>) {
  const { of, path, label, placeholder, disabled, required, className } = props;

  const { data: warehouses = [] } = useGetWarehouses({ includeSite: true });

  // Kho trung tâm trước, kho công trường sau (nhãn kèm mã CT để nhận diện)
  const options = warehouses
    .slice()
    .sort((a, b) => {
      if (a.site && !b.site) return 1;
      if (!a.site && b.site) return -1;
      return a.code.localeCompare(b.code);
    })
    .map((warehouse) => ({
      value: String(warehouse.id),
      label:
        `${warehouse.code} - ${warehouse.name}` +
        (warehouse.site ? ` (${warehouse.site.code})` : ""),
    }));

  return (
    <SelectField
      of={of}
      path={path}
      label={label}
      placeholder={placeholder ?? "Chọn kho"}
      disabled={disabled}
      required={required}
      className={className}
      options={options}
      transform={(value) =>
        Number(value) as PathValue<v.InferInput<TSchema>, TFieldPath>
      }
    />
  );
}
