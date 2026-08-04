import * as v from "valibot";

const EnvSchema = v.object({
  API_URL: v.string(),
  APP_URL: v.optional(v.string(), "http://localhost:3000"),
  GOOGLE_MAP_API: v.string(),
});

/**
 * Tạo và kiểm tra định dạng của biến môi trường (chỉ lưu trữ các biến phía
 * client)
 *
 * @returns Một đối tượng chứa các biến môi trường đã được kiểm tra định dạng
 */
const createEnv = () => {
  const rawEnvVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    GOOGLE_MAP_API: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
  };

  // Hàm safeParse của Valibot nhận Schema là tham số đầu tiên
  const parsedEnv = v.safeParse(EnvSchema, rawEnvVars);

  // Tiến hành kiểm tra định dạng biến môi trường, nếu biến môi trường có
  // kiểu dữ liệu không hợp lệ => dừng chương trình
  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided. The following variables are missing or invalid:\n${parsedEnv.issues
        .map((issue) => {
          // Valibot cung cấp mảng path để lấy chính xác tên key bị lỗi thay vì dùng index
          const key = issue.path?.[0]?.key ?? "Unknown key";
          return `      - ${key}: ${issue.message}`;
        })
        .join("\n")}\n      `,
    );
  }

  // Nếu success === true, dữ liệu hợp lệ sẽ nằm trong thuộc tính .output
  return parsedEnv.output;
};

export const env = createEnv();
