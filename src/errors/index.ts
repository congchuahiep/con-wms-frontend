/**
 * Lớp lỗi thống nhất cho toàn bộ app.
 *
 * Mọi lỗi từ backend (thông qua axios) đều được handleAxiosError
 * chuyển thành một trong các subclass sau, giúp UI chỉ cần switch
 * theo error.name thay vì phân tích axios response.
 */

export type ErrorCode =
  | "AUTH_ERROR" // 401/403 — token hết hạn hoặc không hợp lệ
  | "VALIDATION_ERROR" // 400 với field errors
  | "NOT_FOUND" // 404
  | "CONFLICT" // 409 — trùng lặp
  | "NETWORK_ERROR" // không có response (mất mạng, timeout, CORS)
  | "SERVER_ERROR"; // 5xx — lỗi server

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor(message: string, code: ErrorCode, status: number, name: string) {
    super(message);
    this.name = name;
    this.code = code;
    this.status = status;
  }
}

export class AuthError extends AppError {
  constructor(message = "Phiên đăng nhập hết hạn hoặc không hợp lệ") {
    super(message, "AUTH_ERROR", 401, "AuthError");
  }
}

export class ValidationError extends AppError {
  readonly fields: Record<string, string[]>;

  constructor(fields: Record<string, string[]>) {
    const message = "Dữ liệu không hợp lệ";
    super(message, "VALIDATION_ERROR", 400, "ValidationError");
    this.fields = fields;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Không tìm thấy tài nguyên") {
    super(message, "NOT_FOUND", 404, "NotFoundError");
  }
}

export class ConflictError extends AppError {
  readonly duplicates: string[];

  constructor(message: string, duplicates: string[] = []) {
    super(message, "CONFLICT", 409, "ConflictError");
    this.duplicates = duplicates;
  }
}

export class NetworkError extends AppError {
  constructor(message = "Lỗi kết nối mạng, vui lòng thử lại") {
    super(message, "NETWORK_ERROR", 0, "NetworkError");
  }
}

export class ServerError extends AppError {
  constructor(message = "Lỗi server, vui lòng thử lại sau") {
    super(message, "SERVER_ERROR", 500, "ServerError");
  }
}
