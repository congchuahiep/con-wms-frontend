"use client";

import type {
  FormSchema,
  FormStore,
  PathValue,
  RequiredPath,
  ValidPath,
} from "@formisch/react";
import { useMemo } from "react";
import type * as v from "valibot";
import { SelectField } from "@/components/form/SelectField";
import { cn } from "@/lib/utils";
import { useGetCategories } from "./services";
import type { MaterialCategory } from "./types";
import { getCategoryColorClass } from "./utils";

type CategorySelectFieldProps<
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

interface FlattenedOption {
  value: string;
  label: string;
  depth: number;
}

/** Flatten tree → select options + depth metadata */
function flattenForSelect(
  nodes: MaterialCategory[],
  depth = 0,
): FlattenedOption[] {
  return nodes.flatMap((node) => [
    { value: String(node.id), label: node.name, depth },
    ...flattenForSelect(node.children, depth + 1),
  ]);
}

export function CategorySelectField<
  TSchema extends FormSchema = FormSchema,
  TFieldPath extends RequiredPath = RequiredPath,
>(props: CategorySelectFieldProps<TSchema, TFieldPath>) {
  const { of, path, label, placeholder, disabled, required, className } = props;

  const { data: categories = [] } = useGetCategories();

  const { options, depthMap } = useMemo(() => {
    const flat = flattenForSelect(categories);
    const depthMap = new Map<string, number>();
    for (const opt of flat) {
      depthMap.set(opt.value, opt.depth);
    }
    const simpleOptions = flat.map(({ value, label }) => ({ value, label }));
    return { options: simpleOptions, depthMap };
  }, [categories]);

  return (
    <SelectField
      of={of}
      path={path}
      label={label}
      placeholder={placeholder ?? "Chọn danh mục"}
      disabled={disabled}
      required={required}
      className={className}
      options={options}
      transform={(v: string) =>
        (v === "" ? null : Number(v)) as PathValue<
          v.InferInput<TSchema>,
          TFieldPath
        >
      }
      renderValue={(opt: { value: string; label: string }) => opt.label}
      renderOption={(opt: { value: string; label: string }) => {
        const depth = depthMap.get(opt.value) ?? 0;

        const categoryId = Number(opt.value);
        const findNode = (
          nodes: MaterialCategory[],
        ): MaterialCategory | undefined => {
          for (const node of nodes) {
            if (node.id === categoryId) return node;
            const found = findNode(node.children);
            if (found) return found;
          }
        };
        const category = findNode(categories);
        const colorClass = getCategoryColorClass(category?.color ?? null);

        return (
          <span
            className="flex items-center gap-2"
            style={{ paddingLeft: `${depth * 20}px` }}
          >
            <span
              className={cn(
                "inline-block rounded-full shrink-0 border",
                "size-2.5",
                colorClass,
              )}
            />
            <span className="truncate">{opt.label}</span>
          </span>
        );
      }}
    />
  );
}
