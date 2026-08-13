export type ErrorCode =
  | "AUTH_ERROR"
  | "PERMISSION_ERROR"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NETWORK_ERROR"
  | "SERVER_ERROR"
  | "UNDEFINED_ERROR"
  | string; // Bất kỳ loại lỗi nào khác

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor(
    code: ErrorCode,
    message: string,
    status: number,
    name: string = "AppError",
  ) {
    super(message);
    this.name = name;
    this.code = code;
    this.status = status;
  }
}

export class DuplicateError extends AppError {
  public duplicates: string[];

  constructor(code = "DUPLICATE_ERROR", message: string, duplicates: string[]) {
    super(code, message, 400, "DuplicateError");
    this.duplicates = duplicates;
  }
}

export class BlockProtectedError extends AppError {
  public blockedBy: string[];

  constructor(
    code = "BLOCKED_PROTECTED_ERROR",
    message: string,
    blockedBy: string[],
  ) {
    super(code, message, 409, "BlockProtectedError");
    this.blockedBy = blockedBy;
  }
}

export class AuthError extends AppError {
  constructor(
    code: ErrorCode = "AUTH_ERROR",
    message = "Phiên đăng nhập hết hạn hoặc không hợp lệ",
  ) {
    super(code, message, 401, "AuthError");
  }
}

export class PermissionError extends AppError {
  constructor(code: ErrorCode = "PERMISSION_ERROR", message = "") {
    super(code, message, 403, "PermissionError");
  }
}

export class ValidationError extends AppError {
  readonly fields: Record<string, string[]>;

  constructor(message: string, fields: Record<string, string[]>) {
    super("VALIDATION_ERROR", message, 400, "ValidationError");
    this.fields = fields;
  }
}

export class NotFoundError extends AppError {
  constructor(
    code: ErrorCode = "NOT_FOUND",
    message = "Không tìm thấy tài nguyên",
  ) {
    super(code, message, 404, "NotFoundError");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super("CONFLICT", message, 409, "ConflictError");
  }
}

export class NetworkError extends AppError {
  constructor(message = "Lỗi kết nối mạng, vui lòng thử lại") {
    super("NETWORK_ERROR", message, 0, "NetworkError");
  }
}

export class ServerError extends AppError {
  constructor(message = "Lỗi server, vui lòng thử lại sau") {
    super("SERVER_ERROR", message, 500, "ServerError");
  }
}
