"use client";

import {
  type DeepPartial,
  type FormSchema,
  type FormStore,
  reset,
  type SubmitEventHandler,
  useForm,
} from "@formisch/react";
import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import type * as v from "valibot";
import { type AppError, ValidationError } from "@/errors";
import { setFieldErrors } from "@/utils/form-errors";

export interface UsePostOptions<
  TSchema extends FormSchema,
  TData = unknown,
  TError = AppError,
  TOnMutateResult = unknown,
> extends Pick<
    UseMutationOptions<TData, TError, v.InferOutput<TSchema>, TOnMutateResult>,
    "mutationFn" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  > {
  /**
   * Schema Valibot để validate form.
   */
  schema: TSchema;

  /**
   * Giá trị mặc định cho form.
   */
  initialInput?: DeepPartial<v.InferInput<TSchema>>;

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
   * Có reset form sau khi mutation thành công không?
   * @default true
   */
  resetOnSuccess?: boolean;

  /**
   * Các tùy chọn bổ sung cho useMutation.
   */
  mutationOptions?: Omit<
    UseMutationOptions<TData, TError, v.InferOutput<TSchema>, TOnMutateResult>,
    "mutationFn" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  >;
}

export interface UsePostReturn<
  TSchema extends FormSchema,
  TData = unknown,
  TError = AppError,
> {
  /**
   * Form store từ Formisch.
   */
  form: FormStore<TSchema>;

  /**
   * Trigger mutation.
   */
  mutate: UseMutationResult<TData, TError, v.InferOutput<TSchema>>["mutate"];

  /**
   * Trigger mutation và trả về Promise.
   */
  mutateAsync: UseMutationResult<
    TData,
    TError,
    v.InferOutput<TSchema>
  >["mutateAsync"];

  /**
   * Mutation đang chạy.
   */
  isPending: boolean;

  /**
   * Mutation gặp lỗi.
   */
  isError: boolean;

  /**
   * Mutation thành công.
   */
  isSuccess: boolean;

  /**
   * Lỗi mutation nếu có.
   */
  error: TError | null;

  /**
   * Dữ liệu trả về từ mutation nếu thành công.
   */
  data: TData | undefined;

  /**
   * Trạng thái mutation.
   */
  status: UseMutationResult<TData, TError, v.InferOutput<TSchema>>["status"];

  /**
   * Handler submit form — validate rồi trigger mutation.
   * Dùng trực tiếp cho prop `onSubmit` của Formisch `<Form>`.
   */
  handleSubmit: SubmitEventHandler<TSchema>;

  /**
   * Reset cả form và mutation.
   */
  reset: () => void;

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
 * Custom hook kết hợp Formisch + TanStack Query để thực hiện POST form.
 *
 * Tự động:
 * - Validate form bằng Valibot schema
 * - Reset form sau khi thành công (có thể tắt)
 * - Map `ValidationError` từ server vào đúng field
 */
export function usePost<
  TSchema extends FormSchema,
  TData = unknown,
  TError = AppError,
  TOnMutateResult = unknown,
>(
  options: UsePostOptions<TSchema, TData, TError, TOnMutateResult>,
): UsePostReturn<TSchema, TData, TError> {
  const {
    schema,
    initialInput,
    validate,
    revalidate,
    resetOnSuccess = true,
    mutationFn,
    mutationOptions = {},
    onMutate,
    onSuccess,
    onError,
    onSettled,
  } = options;

  const form = useForm({
    schema,
    initialInput,
    validate,
    revalidate,
  });

  const mutation = useMutation<
    TData,
    TError,
    v.InferOutput<TSchema>,
    TOnMutateResult
  >({
    mutationFn,
    ...mutationOptions,
    onMutate,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (resetOnSuccess) reset(form);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      if (error instanceof ValidationError) {
        setFieldErrors(form, error.fields);
      }
      onError?.(error, variables, onMutateResult, context);
    },
    onSettled,
  });

  const handleSubmit: SubmitEventHandler<TSchema> = async (output) => {
    try {
      await mutation.mutateAsync(output);
    } catch {
      // Lỗi đã được mutation.onError xử lý (map ValidationError vào form,
      // hoặc để lại trong mutation.error cho UI hiển thị)
    }
  };

  const handleReset = () => {
    reset(form);
    mutation.reset();
  };

  return {
    form,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    status: mutation.status,
    handleSubmit,
    reset: handleReset,
    resetForm: () => reset(form),
    resetMutation: () => mutation.reset(),
  };
}
