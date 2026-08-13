import axios from "axios";
import { ResultAsync } from "neverthrow";
import { type NextRequest, NextResponse } from "next/server";
import { cookieConfig, cookieNames } from "@/configs/cookie";
import { env } from "@/configs/env";
import type { AppError } from "@/errors";
import { getValidToken } from "@/features/auth/server";
import { classifyError } from "@/utils/classify-error";

/**
 * Proxy ALL — forward mọi HTTP method từ client tới backend Django.
 *
 *  [Client Axios]
 *        ↓ (browser tự gửi httpOnly cookie)
 *  [Next.js /api/proxy/[...path]]
 *        ↓ getValidToken(): đọc access cookie, nếu hết hạn → refresh
 *        ↓ gắn Authorization: Bearer <access> header
 *        ↓ forward request (method, query, body, content-type)
 *  [Django Backend]
 *        ↓ verify JWT + xử lý + trả data
 *  [Client] nhận data ( KHÔNG thấy JWT bao giờ)
 *
 * Nếu token vừa được refresh, set cookie mới trong response.
 */
export async function ALL(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params;
  const url = `${env.API_URL}/${path.join("/")}/`;

  const body = request.body ? await request.arrayBuffer() : undefined;

  // Lấy token hợp lệ (tự refresh nếu cần)
  const tokenResult = await getValidToken();

  if (tokenResult.isErr()) {
    return createErrorResponse(tokenResult.error, null);
  }

  const {
    access: accessToken,
    refresh: refreshToken,
    isNew: isTokenRefreshed,
  } = tokenResult.value;

  // Forward request tới backend
  return ResultAsync.fromPromise(
    axios({
      url,
      method: request.method,
      params: request.nextUrl.searchParams,
      data: body,
      responseType: "arraybuffer",
      transformResponse: [
        (data: ArrayBuffer, headers: Record<string, unknown>) => {
          const ct = String(headers["content-type"] || "");
          if (ct.includes("application/json")) {
            const text = Buffer.from(data).toString("utf-8");
            return JSON.parse(text);
          }
          return data;
        },
      ],
      headers: {
        "Content-Type":
          request.headers.get("content-type") || "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    }),
    classifyError,
  ).match(
    (response) => {
      const contentType =
        typeof response.headers["content-type"] === "string"
          ? String(response.headers["content-type"])
          : "";

      let nextResponse: NextResponse;

      if (response.status === 204) {
        nextResponse = new NextResponse(null, { status: 204 });
      } else if (!contentType.includes("application/json")) {
        nextResponse = new NextResponse(response.data, {
          status: response.status,
          headers: { "Content-Type": contentType },
        });
      } else {
        nextResponse = NextResponse.json(response.data, {
          status: response.status,
        });
      }

      // Nếu token vừa mới refresh → set cookie mới
      if (isTokenRefreshed) {
        nextResponse.cookies.set(
          cookieNames.access,
          accessToken,
          cookieConfig.access,
        );
        nextResponse.cookies.set(
          cookieNames.refresh,
          refreshToken,
          cookieConfig.refresh,
        );
      }

      return nextResponse;
    },
    (error: AppError) =>
      createErrorResponse(error, isTokenRefreshed ? refreshToken : null),
  );
}

function createErrorResponse(
  error: AppError,
  _refreshToken: string | null,
): NextResponse {
  // Tách metadata nội bộ (name, status) và message (đã map thành detail),
  // giữ lại code + mọi extra field của subclass (fields, blockedBy, duplicates, ...)

  console.error(error);

  const {
    name: _name,
    status: _status,
    message: _message,
    code: _code,
    ...extraFields
  } = error;

  const body: Record<string, unknown> = {
    detail: error.message,
    code: error.code,
    ...extraFields,
  };

  const response = NextResponse.json(body, { status: error.status });

  // Nếu là AuthError (token hết hạn, refresh thất bại) → xóa cookie
  if (error.name === "AuthError") {
    response.cookies.delete(cookieNames.access);
    response.cookies.delete(cookieNames.refresh);
  }

  return response;
}

export const GET = ALL;
export const POST = ALL;
export const PUT = ALL;
export const PATCH = ALL;
export const DELETE = ALL;
