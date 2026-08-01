import { ResultAsync } from "neverthrow";
import { type NextRequest, NextResponse } from "next/server";
import type { InferOutput } from "valibot";
import { internalApi } from "@/configs/api";
import { cookieConfig, cookieNames } from "@/configs/cookie";
import type { LoginSchema } from "@/features/auth/schemas";
import type { TokenPair } from "@/features/auth/types";
import { handleAxiosError } from "@/utils/handlerAxiosError";

/**
 * BFF POST /api/auth/login
 *
 * Nhận credentials từ client → gọi backend → nhận { access, refresh }
 * → set httpOnly cookie → trả về { message } cho client.
 *
 * Client KHÔNG bao giờ thấy JWT.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = (await request.json()) as InferOutput<typeof LoginSchema>;

  return ResultAsync.fromPromise(
    internalApi.post<TokenPair>((ep) => ep.auth.login, data),
    handleAxiosError,
  ).match(
    (response) => {
      const { access, refresh } = response.data;

      const resultResponse = NextResponse.json({
        message: "Đăng nhập thành công",
      });

      resultResponse.cookies.set(
        cookieNames.access,
        access,
        cookieConfig.access,
      );
      resultResponse.cookies.set(
        cookieNames.refresh,
        refresh,
        cookieConfig.refresh,
      );

      return resultResponse;
    },
    (error) => {
      return NextResponse.json(
        { detail: error.message, code: error.code },
        { status: error.status },
      );
    },
  );
}
