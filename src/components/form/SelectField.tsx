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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectFieldProps<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
> = {
  /** Form store từ useForm. */
  of: FormStore<TSchema>;
  /** Path đến field trong schema. */
  path: ValidPath<v.InferInput<TSchema>, TFieldPath>;
  /** Label hiển thị. */
  label?: string;
  /** Placeholder khi chưa chọn. */
  placeholder?: string;
  /** Mô tả phụ dưới select. */
  description?: string;
  /** Vô hiệu hóa select. */
  disabled?: boolean;
  /** Hiển thị dấu * khi field bắt buộc. */
  required?: boolean;
  /** Class name cho Field wrapper. */
  className?: string;
  /** Class name cho trigger. */
  triggerClassName?: string;
  /** Danh sách options. */
  options: Array<{ value: string; label: string }>;
  /**
   * Hàm biến đổi giá trị string từ select sang giá trị schema.
   * Ví dụ: chuyển string sang number hoặc null.
   * Mặc định: trả về chính string đó.
   */
  transform?: (value: string) => PathValue<v.InferInput<TSchema>, TFieldPath>;
  /** Custom render cho mỗi option item trong dropdown. */
  renderOption?: (option: { value: string; label: string }) => React.ReactNode;
  /** Custom render cho giá trị đã chọn trên trigger. */
  renderValue?: (option: { value: string; label: string }) => React.ReactNode;
  /** Bỏ qua Field wrapper, chỉ render Select thuần. */
  noField?: boolean;
};

const EMPTY_VALUE = "__empty__";

export function SelectField<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
>(props: SelectFieldProps<TSchema, TFieldPath>) {
  const {
    of,
    path,
    label,
    placeholder = "(Không có)",
    description,
    disabled,
    className,
    triggerClassName,
    required,
    options,
    transform,
    renderOption,
    renderValue,
    noField,
  } = props;

  return (
    <FormField of={of} path={path}>
      {(field) => {
        const renderSelectedValue = (value: string | null) => {
          if (!value || value === EMPTY_VALUE) return placeholder;
          const option = options.find((o) => o.value === value);
          if (!option) return value;
          return renderValue ? renderValue(option) : option.label;
        };

        const selectValue =
          field.input === null || field.input === undefined
            ? EMPTY_VALUE
            : String(field.input);

        const handleValueChange = (next: string | null) => {
          if (next === null || next === EMPTY_VALUE) {
            if (required) return;
            field.onChange(
              null as unknown as PartialValues<
                PathValue<v.InferInput<TSchema>, TFieldPath>
              >,
            );
            return;
          }
          const transformed = transform
            ? transform(next)
            : (next as PathValue<v.InferInput<TSchema>, TFieldPath>);
          field.onChange(transformed as PartialValues<typeof transformed>);
        };

        const select = (
          <Select value={selectValue} onValueChange={handleValueChange}>
            <SelectTrigger
              disabled={disabled}
              name={field.props.name}
              autoFocus={field.props.autoFocus}
              aria-invalid={field.errors ? true : undefined}
              className={triggerClassName}
            >
              <SelectValue placeholder={placeholder}>
                {renderSelectedValue}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {!required && (
                <SelectItem value={EMPTY_VALUE}>{placeholder}</SelectItem>
              )}
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {renderOption ? renderOption(opt) : opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

        if (noField) return select;

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
            {select}
            {description && <FieldDescription>{description}</FieldDescription>}
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
