import type { AxiosError } from "axios";
import {
  AppError,
  AuthError,
  ConflictError,
  NetworkError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "@/errors";

/**
 * Chuyển lỗi axios (đều là any) thành AppError cụ thể.
 * Hỗ trợ cả 2 dạng field errors của Django REST Framework:
 *   - { detail: "..." }                      — lỗi chung
 *   - { email: ["..."], password: ["..."] }  — lỗi per-field
 *
 * Nhận `unknown` để tương thích với neverthrow's ResultAsync.fromPromise,
 * sau đó ép kiểu an toàn sang AxiosError.
 */
export function handleAxiosError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  const axiosError = error as AxiosError;

  // Không có response → mất mạng / timeout / CORS block
  if (!axiosError.response) {
    return new NetworkError();
  }

  const { status, data } = axiosError.response;
  const payload = data as Record<string, unknown> | undefined;

  // DRF trả về { detail: "..." }
  const detail =
    typeof payload?.detail === "string" ? payload.detail : undefined;

  // DRF trả về { field: ["error", ...], ... }
  const isFieldErrors =
    payload !== undefined &&
    typeof payload === "object" &&
    Object.values(payload).every(
      (v) => Array.isArray(v) && v.every((item) => typeof item === "string"),
    );

  switch (status) {
    case 400:
      if (isFieldErrors && payload) {
        return new ValidationError(payload as Record<string, string[]>);
      }
      return new ValidationError({ _: [detail ?? "Dữ liệu không hợp lệ"] });

    case 401:
    case 403:
      return new AuthError(detail);

    case 404:
      return new NotFoundError(detail);

    case 409:
      return new ConflictError(detail ?? "Xung đột dữ liệu");

    default:
      if (status >= 500) return new ServerError(detail);
      return new AppError(
        detail ?? "Lỗi không xác định",
        "SERVER_ERROR",
        status,
        "AppError",
      );
  }
}
