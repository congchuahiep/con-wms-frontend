import * as v from "valibot";

export const LoginSchema = v.object({
  email: v.pipe(
    v.string("Vui lòng nhập email"),
    v.nonEmpty("Vui lòng nhập email"),
    v.email("Email không đúng định dạng"),
  ),
  password: v.pipe(
    v.string("Vui lòng nhập mật khẩu"),
    v.nonEmpty("Vui lòng nhập mật khẩu"),
    v.minLength(3, "Mật khẩu phải có ít nhất 3 ký tự"),
  ),
});

export type LoginOutput = v.InferOutput<typeof LoginSchema>;
