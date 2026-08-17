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

  const { data: warehouses = [] } = useGetWarehouses();

  const options = warehouses.map((warehouse) => ({
    value: String(warehouse.id),
    label: `${warehouse.code} - ${warehouse.name}`,
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
