/**
 * Response từ POST `/api/auth/login/` và POST `/api/auth/refresh/`
 */
export interface TokenPair {
  access: string;
  refresh: string;
}

/**
 * Response từ POST `/api/auth/register/`
 */
export interface RegisterResponse {
  user: UserProfile;
  access: string;
  refresh: string;
}

/**
 * Response từ GET `/api/auth/me/`
 */
export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

/**
 * Request body gửi lên POST `/api/auth/login/`
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Request body gửi lên POST `/api/auth/register/`
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Request body gửi lên POST `/api/auth/refresh/`
 */
export interface RefreshRequest {
  refresh: string;
}

/**
 * Request body gửi lên POST `/api/auth/logout/`
 */
export interface LogoutRequest {
  refresh: string;
}

/**
 * Tham chiếu gọn cho nested reference trong response
 * (vd: StockMovement.createdBy, InboundNote.voidedBy)
 */
export type SimpleUser = {
  id: number;
  email: string;
};
