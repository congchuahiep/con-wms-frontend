"use client";

import { setErrors, type FormSchema, type FormStore } from "@formisch/react";

/**
 * Ánh xạ lỗi validation từ server (dạng `{ field: [messages] }`)
 * vào các field tương ứng trong Formisch form.
 *
 * @note Hiện tại chỉ hỗ trợ top-level fields. Nếu server trả về lỗi lồng
 * nhau (ví dụ `user.email`), cần mở rộng helper để parse path.
 */
export function setFieldErrors<TSchema extends FormSchema>(
  form: FormStore<TSchema>,
  errors: Record<string, string[]>,
) {
  for (const [key, messages] of Object.entries(errors)) {
    setErrors(form as never, {
      path: [key] as [string],
      errors: messages as [string, ...string[]],
    } as never);
  }
}
