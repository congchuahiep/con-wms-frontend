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
import { useGetSuppliers } from "./services";

type SupplierSelectFieldProps<
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

/** Select nhà cung cấp — options từ `useGetSuppliers` (không phân trang). */
export function SupplierSelectField<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
>(props: SupplierSelectFieldProps<TSchema, TFieldPath>) {
  const { of, path, label, placeholder, disabled, required, className } = props;

  const { data: suppliers = [] } = useGetSuppliers();

  const options = suppliers.map((supplier) => ({
    value: String(supplier.id),
    label: `${supplier.code} - ${supplier.name}`,
  }));

  return (
    <SelectField
      of={of}
      path={path}
      label={label}
      placeholder={placeholder ?? "Chọn nhà cung cấp"}
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
