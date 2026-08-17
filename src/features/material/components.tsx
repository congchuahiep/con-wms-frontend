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
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as v from "valibot";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroupAddon } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useGetMaterials } from "./services";
import type { SimpleMaterial } from "./types";

const DEBOUNCE_MS = 300;

function toSimpleMaterial(m: {
  id: number;
  code: string;
  name: string;
}): SimpleMaterial {
  return { id: m.id, code: m.code, name: m.name };
}

interface MaterialComboboxProps {
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  /** Seed cache — dùng khi edit: materials của các dòng đã chọn. */
  initialItems?: SimpleMaterial[];
}

/**
 * Combobox chọn vật tư (search server-side, debounce 300ms).
 * Controlled: value = material id | null.
 */
export function MaterialCombobox({
  value,
  onChange,
  placeholder = "Chọn vật tư",
  disabled,
  invalid,
  className,
  initialItems,
}: MaterialComboboxProps) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (next: string) => {
    setInputValue(next);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => setDebouncedSearch(next),
      DEBOUNCE_MS,
    );
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const { data, isFetching } = useGetMaterials({
    search: debouncedSearch || undefined,
    pageSize: 20,
  });

  // Gộp kết quả query + initialItems (edit mode) — giữ item đã chọn
  // kể cả khi không nằm trong kết quả filter hiện tại.
  const items = useMemo(() => {
    const map = new Map<number, SimpleMaterial>();
    for (const item of initialItems ?? []) {
      map.set(item.id, toSimpleMaterial(item));
    }
    for (const item of data?.items ?? []) {
      map.set(item.id, toSimpleMaterial(item));
    }
    return Array.from(map.values()).sort((a, b) =>
      a.code.localeCompare(b.code),
    );
  }, [data, initialItems]);

  const selected =
    value === null ? null : (items.find((m) => m.id === value) ?? null);

  return (
    <Combobox<SimpleMaterial>
      items={items}
      value={selected}
      onValueChange={(item) => {
        onChange(item ? item.id : null);
        setInputValue("");
        setDebouncedSearch("");
      }}
      onInputValueChange={handleInputChange}
    >
      <ComboboxInput
        showTrigger={false}
        className={cn("w-full", className)}
        value={selected ? `${selected.code} - ${selected.name}` : inputValue}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => {
          if (selected) setInputValue("");
        }}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      >
        <InputGroupAddon align="inline-end">
          {isFetching ? (
            <Spinner className="size-3.5 text-muted-foreground" />
          ) : (
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="text-muted-foreground"
            />
          )}
        </InputGroupAddon>
      </ComboboxInput>

      <ComboboxContent sideOffset={4}>
        <ComboboxEmpty>
          {isFetching ? "Đang tìm..." : "Không tìm thấy vật tư"}
        </ComboboxEmpty>
        <ComboboxList>
          {(item: SimpleMaterial) => (
            <ComboboxItem key={item.id} value={item}>
              <span className="font-mono text-xs">{item.code}</span>
              <span className="truncate text-muted-foreground">
                {item.name}
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

type MaterialSelectFieldProps<
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
  initialItems?: SimpleMaterial[];
  noField?: boolean;
};

/** Phiên bản Formisch field của MaterialCombobox — dùng trong form (of + path). */
export function MaterialSelectField<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
>(props: MaterialSelectFieldProps<TSchema, TFieldPath>) {
  const {
    of,
    path,
    label,
    placeholder,
    disabled,
    required,
    className,
    initialItems,
    noField,
  } = props;

  return (
    <FormField of={of} path={path}>
      {(field) => {
        const select = (
          <MaterialCombobox
            value={
              field.input === null || field.input === undefined
                ? null
                : Number(field.input)
            }
            onChange={(id) =>
              field.onChange(
                id as PartialValues<
                  PathValue<v.InferInput<TSchema>, TFieldPath>
                >,
              )
            }
            placeholder={placeholder}
            disabled={disabled}
            invalid={field.errors ? true : undefined}
            initialItems={initialItems}
          />
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
