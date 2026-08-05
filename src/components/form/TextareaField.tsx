"use client";

import {
  Field as FormField,
  type FormSchema,
  type FormStore,
  type PartialValues,
  type PathValue,
  type RequiredPath,
  type ValidPath,
} from "@formisch/react";
import type * as React from "react";
import type * as v from "valibot";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type TextareaFieldProps<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
> = {
  /**
   * Form store từ useForm.
   */
  of: FormStore<TSchema>;
  /**
   * Path đến field trong schema.
   */
  path: ValidPath<v.InferInput<TSchema>, TFieldPath>;
  /**
   * Label hiển thị.
   */
  label?: string;
  /**
   * Mô tả phụ dưới textarea.
   */
  description?: string;
  /**
   * Placeholder khi chưa nhập.
   */
  placeholder?: string;
  /**
   * Vô hiệu hóa textarea.
   */
  disabled?: boolean;
  /**
   * Hiển thị dấu * khi field bắt buộc.
   */
  required?: boolean;
  /**
   * Class name cho Field wrapper.
   */
  className?: string;
  /**
   * Class name cho Textarea.
   */
  inputClassName?: string;
} & Omit<
  React.ComponentProps<typeof Textarea>,
  "name" | "value" | "onChange" | "ref"
>;

export function TextareaField<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
>({
  of,
  path,
  label,
  description,
  placeholder,
  disabled,
  className,
  inputClassName,
  required,
  ...textareaProps
}: TextareaFieldProps<TSchema, TFieldPath>) {
  return (
    <FormField of={of} path={path}>
      {(field) => (
        <Field data-invalid={field.errors ? true : undefined} className={className}>
          {label && (
            <FieldLabel htmlFor={field.props.name}>
              {label} {required && <span className="text-red-500">*</span>}
            </FieldLabel>
          )}
          <Textarea
            {...field.props}
            {...textareaProps}
            id={field.props.name}
            value={(field.input ?? "") as string | undefined}
            onChange={(e) =>
              field.onChange(
                e.target.value as PartialValues<
                  PathValue<v.InferInput<TSchema>, TFieldPath>
                >,
              )
            }
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={field.errors ? true : undefined}
            className={inputClassName}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {field.errors && (
            <FieldError
              errors={field.errors.map((message) => ({ message }))}
            />
          )}
        </Field>
      )}
    </FormField>
  );
}
