import type { AxiosError } from "axios";
import {
  AppError,
  AuthError,
  BlockProtectedError,
  ConflictError,
  DuplicateError,
  NetworkError,
  NotFoundError,
  PermissionError,
  ServerError,
  ValidationError,
} from "@/errors";

/**
 * Chuyển lỗi axios (đều là any) thành AppError cụ thể.
 *
 * Hỗ trợ format error response chuẩn hóa từ backend:
 *   {
 *     "code": "error_code",     // metadata – mã lỗi
 *     "detail": "message",      // metadata – thông điệp
 *     "fields": {               // (chỉ ValidationError) lỗi theo field
 *       "fieldName": ["error 1", "error 2"]
 *     }
 *   }
 *
 * Format này tránh collision khi model có field tên `code` hoặc `detail`.
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

  // Metadata keys – luôn là string ở top-level
  const code = toStringOrUndefinded(payload?.code);
  const detail = toStringOrUndefinded(payload?.detail);

  switch (status) {
    case 400:
      return classify400(payload, code, detail);

    case 401:
      return new AuthError(code, detail);
    case 403:
      return new PermissionError(code, detail);

    case 404:
      return new NotFoundError("NOT_FOUND", detail);

    case 409:
      return classify409(payload, code, detail);

    default:
      if (status >= 500) return new ServerError(detail);
      return new AppError(
        code ?? "SERVER_ERROR",
        detail ?? "Lỗi không xác định",
        status,
        "AppError",
      );
  }
}

/** Ép unknown → string | undefined an toàn */
function toStringOrUndefinded(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Xử lý lỗi 400 Bad Request.
 *
 * Backend trả về format:
 *   {
 *     "code": "invalid",
 *     "detail": "Dữ liệu không hợp lệ",
 *     "fields": {
 *       "code": ["Mã này đã tồn tại"],
 *       "name": ["Tên không được để trống"]
 *     }
 *   }
 *
 * Trong đó `fields` chỉ có mặt khi là ValidationError.
 */
function classify400(
  data: Record<string, unknown> | undefined,
  metadataCode: string | undefined,
  metadataDetail: string | undefined,
): AppError {
  if (!data || typeof data !== "object") {
    return new AppError(
      metadataCode ?? "BAD_REQUEST",
      metadataDetail ?? "Yêu cầu không hợp lệ",
      400,
    );
  }

  // Field errors nằm trong key `fields` (format mới, tránh collision)
  const fields = data.fields;
  if (isFieldErrorsRecord(fields)) {
    const message =
      metadataDetail ??
      (Object.values(fields).flat()[0] as string) ??
      "Dữ liệu không hợp lệ";

    return new ValidationError(message, fields);
  }

  // DuplicateError: mảng `duplicates` ở top-level
  if (Array.isArray(data.duplicates)) {
    return new DuplicateError(
      metadataCode ?? "DUPLICATE_ERROR",
      metadataDetail ?? "Một số dữ liệu đã tồn tại",
      data.duplicates as string[],
    );
  }

  // Lỗi đơn giản: chỉ có code + detail, không có fields
  if (metadataDetail) {
    return new AppError(metadataCode ?? "BAD_REQUEST", metadataDetail, 400);
  }

  return new AppError(
    metadataCode ?? "BAD_REQUEST",
    "Yêu cầu không hợp lệ",
    400,
  );
}

function classify409(
  data: Record<string, unknown> | undefined,
  metadataCode: string | undefined,
  metadataDetail: string | undefined,
): AppError {
  if (!data || typeof data !== "object")
    return new ConflictError(metadataDetail ?? "Xung đột dữ liệu");

  // DuplicateError
  if (Array.isArray(data.duplicates)) {
    return new DuplicateError(
      metadataCode ?? "DUPLICATE_ERROR",
      metadataDetail ?? "Một số dữ liệu đã tồn tại",
      data.duplicates as string[],
    );
  }

  // BlockProtectedError
  if (Array.isArray(data.blockedBy)) {
    return new BlockProtectedError(
      metadataCode ?? "BLOCKED_PROTECTED_ERROR",
      metadataDetail ?? "Không thể xóa vì một số đối tượng đang tham chiếu nó",
      data.blockedBy as string[],
    );
  }

  return new ConflictError(metadataDetail ?? "Xung đột dữ liệu");
}

/** Kiểm tra một value có phải là Record<string, string[]> không */
function isFieldErrorsRecord(
  value: unknown,
): value is Record<string, string[]> {
  if (!value || typeof value !== "object") return false;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return false;
  return entries.every(
    ([, v]) => Array.isArray(v) && v.every((item) => typeof item === "string"),
  );
}
