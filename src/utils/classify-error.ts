import type { AxiosError } from "axios";
import DuplicateError, {
  AppError,
  AuthError,
  ConflictError,
  NetworkError,
  NotFoundError,
  PermissionError,
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
export function classifyError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  const axiosError = error as AxiosError;

  // Không có response → mất mạng / timeout / CORS block
  if (!axiosError.response) {
    return new NetworkError();
  }

  const { status, data } = axiosError.response;
  const payload = data as Record<string, unknown> | undefined;
  const rawCode = payload?.code;
  const code =
    typeof rawCode === "string" && rawCode.length > 0 ? rawCode : undefined;
  const detail =
    typeof payload?.detail === "string" ? payload.detail : undefined;

  switch (status) {
    case 400:
      return handleBadRequest(payload);

    case 401:
      return new AuthError(code, detail);
    case 403:
      return new PermissionError(code, detail);

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

/**
 * Xử lý lỗi 400 Bad Request
 *
 * Server có thể trả về 2 dạng:
 *
 * 1. Lỗi đơn giản (có `detail`):
 *    { "code": "token_not_valid", "detail": "Token không hợp lệ" }
 *
 * 2. Lỗi validation theo field (các field dạng mảng string):
 *    { "code": "invalid", "role": ["Cannot set role to OWNER..."] }
 */
function handleBadRequest(data?: Record<string, unknown>): AppError {
  if (!data || typeof data !== "object")
    return new AppError("Yêu cầu không hợp lệ", "BAD_REQUEST", 400);

  const { code, detail, ...rest } = data;
  const apiCode = (code as string) ?? "BAD_REQUEST";

  // Trường hợp 2: Các field dạng mảng string → validation error
  const fieldErrors: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      fieldErrors[key] = value as string[];
    }
  }

  // Trường hợp 3: Trùng lặp (DuplicateError)
  if (Array.isArray(data.duplicates)) {
    return new DuplicateError(
      apiCode,
      typeof detail === "string" ? detail : "Một số dữ liệu đã tồn tại",
      data.duplicates as string[],
    );
  }

  // Có field errors → ValidationError
  if (Object.keys(fieldErrors).length > 0) {
    // Lấy message từ detail hoặc từ lỗi đầu tiên
    const message =
      typeof detail === "string"
        ? detail
        : (Object.values(fieldErrors).flat()[0] ?? "Dữ liệu không hợp lệ");

    return new ValidationError(message, fieldErrors);
  }

  // Trường hợp 1: Có `detail` → lỗi đơn giản
  if (typeof data.detail === "string") {
    return new AppError(apiCode, data.detail, 400);
  }

  // Fallback: lỗi 400 không xác định cấu trúc
  return new AppError(apiCode, "Yêu cầu không hợp lệ", 400);
}
