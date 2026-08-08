"use client";

import {
  type DeepPartial,
  type FormStore,
  reset,
  type SubmitEventHandler,
  useForm,
} from "@formisch/react";
import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import * as v from "valibot";
import { type AppError, ValidationError } from "@/errors";
import { setFieldErrors } from "@/utils/form-errors";

export interface UsePartialUpdateOptions<
  TSchema extends v.ObjectSchema<any, any>,
  TData = unknown,
  TError = AppError,
  TOnMutateResult = unknown,
> extends Pick<
    UseMutationOptions<
      TData,
      TError,
      { id: number | string } & Partial<v.InferOutput<TSchema>>,
      TOnMutateResult
    >,
    "mutationFn" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  > {
  /**
   * Schema Valibot gốc (full) — hook tự tạo partial schema.
   */
  schema: TSchema;

  /**
   * Giá trị hiện tại của entity đang edit — dùng khởi tạo form
   * và so sánh dirty fields khi submit.
   */
  initialInput: DeepPartial<v.InferInput<TSchema>>;

  /**
   * ID của entity đang edit.
   */
  id: number | string;

  /**
   * Query keys cần invalidate sau khi update thành công.
   */
  invalidateKeys?: ReadonlyArray<string | number>;

  /**
   * Chế độ validate lần đầu.
   * @default "submit"
   */
  validate?: "initial" | "touch" | "input" | "change" | "blur" | "submit";

  /**
   * Chế độ revalidate sau lần đầu.
   * @default "input"
   */
  revalidate?: "touch" | "input" | "change" | "blur" | "submit";

  /**
   * Các tùy chọn bổ sung cho useMutation.
   */
  mutationOptions?: Omit<
    UseMutationOptions<
      TData,
      TError,
      { id: number | string } & Partial<v.InferOutput<TSchema>>,
      TOnMutateResult
    >,
    "mutationFn" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  >;
}

export interface UsePartialUpdateReturn<
  TSchema extends v.ObjectSchema<any, any>,
  TData = unknown,
  TError = AppError,
> {
  /**
   * Form store từ Formisch.
   */
  form: FormStore<v.SchemaWithPartial<TSchema, undefined>>;

  /**
   * Có field nào bị thay đổi so với initialInput không?
   * Dùng trực tiếp `form.isDirty` của Formisch.
   */
  isDirty: boolean;

  mutate: UseMutationResult<
    TData,
    TError,
    { id: number | string } & Partial<v.InferOutput<TSchema>>
  >["mutate"];

  mutateAsync: UseMutationResult<
    TData,
    TError,
    { id: number | string } & Partial<v.InferOutput<TSchema>>
  >["mutateAsync"];

  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: TError | null;
  data: TData | undefined;

  status: UseMutationResult<
    TData,
    TError,
    { id: number | string } & Partial<v.InferOutput<TSchema>>
  >["status"];

  /**
   * Handler submit form — validate, lọc dirty fields, trigger mutation.
   */
  handleSubmit: SubmitEventHandler<v.SchemaWithPartial<TSchema, undefined>>;

  /**
   * Reset cả form và mutation.
   */
  resetAll: () => void;

  /**
   * Reset chỉ form.
   */
  resetForm: () => void;

  /**
   * Reset chỉ mutation.
   */
  resetMutation: () => void;
}

/**
 * Custom hook kết hợp Formisch + TanStack Query để thực hiện
 * partial update (PATCH/PUT) form.
 *
 * Tự động:
 * - Tạo partial schema từ schema gốc (mọi field optional)
 * - Khởi tạo form với giá trị hiện tại của entity
 * - Chỉ gửi những field bị thay đổi (dirty tracking)
 * - Map ValidationError từ server vào đúng field
 * - Invalidate query cache sau khi thành công
 */
export function usePartialUpdate<
  TSchema extends v.ObjectSchema<any, any>,
  TData = unknown,
  TError = AppError,
  TOnMutateResult = unknown,
>(
  options: UsePartialUpdateOptions<TSchema, TData, TError, TOnMutateResult>,
): UsePartialUpdateReturn<TSchema, TData, TError> {
  const {
    schema,
    initialInput,
    id,
    invalidateKeys,
    validate,
    revalidate,
    mutationFn,
    mutationOptions = {},
    onMutate,
    onSuccess,
    onError,
    onSettled,
  } = options;

  const queryClient = useQueryClient();

  // Tạo partial schema — mọi field optional
  const partialSchema = useMemo(() => v.partial(schema), [schema]);

  const form = useForm({
    schema: partialSchema,
    initialInput,
    validate,
    revalidate,
  });

  const mutation = useMutation<
    TData,
    TError,
    { id: number | string } & Partial<v.InferOutput<TSchema>>,
    TOnMutateResult
  >({
    mutationFn,
    onMutate,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (invalidateKeys) {
        queryClient.invalidateQueries({ queryKey: invalidateKeys });
      }
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      if (error instanceof ValidationError) {
        setFieldErrors(form, error.fields);
      }
      onError?.(error, variables, onMutateResult, context);
    },
    onSettled,
    ...mutationOptions,
  });

  const handleSubmit: SubmitEventHandler<
    v.SchemaWithPartial<TSchema, undefined>
  > = async (output) => {
    // Lọc ra chỉ những field bị thay đổi so với initialInput
    const dirtyData: Record<string, unknown> = {};
    const initial = initialInput as Record<string, unknown>;
    const out = output as Record<string, unknown>;

    for (const key of Object.keys(out)) {
      if (JSON.stringify(out[key]) !== JSON.stringify(initial[key])) {
        dirtyData[key] = out[key];
      }
    }

    try {
      await mutation.mutateAsync({
        id,
        ...dirtyData,
      } as { id: number | string } & Partial<v.InferOutput<TSchema>>);
    } catch {
      // Lỗi đã được mutation.onError xử lý
    }
  };

  return {
    form,
    isDirty: form.isDirty,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    status: mutation.status,
    handleSubmit,
    resetAll: () => {
      reset(form);
      mutation.reset();
    },
    resetForm: () => reset(form),
    resetMutation: () => mutation.reset(),
  };
}
