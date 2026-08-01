import { ResultAsync } from "neverthrow";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { internalApi } from "@/configs/api";
import { cookieNames } from "@/configs/cookie";
import { handleAxiosError } from "@/utils/handlerAxiosError";

/**
 * BFF POST /api/auth/logout
 *
 * Đọc refresh_token từ httpOnly cookie → gửi lên backend để blacklist
 * → xóa cả 2 cookie khỏi browser.
 */
export async function POST(_request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const refresh = cookieStore.get(cookieNames.refresh)?.value;

  // Nếu có refresh token → gửi lên backend để blacklist
  if (refresh) {
    await ResultAsync.fromPromise(
      internalApi.post((ep) => ep.auth.logout, { refresh }),
      handleAxiosError,
    ).match(
      () => undefined,
      (error) => {
        console.error("Lỗi khi logout khỏi backend:", error.message);
      },
    );
  }

  // Xóa cookie bất kể backend có thành công hay không
  const resultResponse = NextResponse.json({
    message: "Đăng xuất thành công",
  });

  resultResponse.cookies.delete(cookieNames.access);
  resultResponse.cookies.delete(cookieNames.refresh);

  return resultResponse;
}
