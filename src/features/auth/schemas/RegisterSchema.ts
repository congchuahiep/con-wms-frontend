import * as v from "valibot";

export const RegisterSchema = v.pipe(
  v.object({
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
    confirmPassword: v.pipe(
      v.string("Vui lòng xác nhận mật khẩu"),
      v.nonEmpty("Vui lòng xác nhận mật khẩu"),
    ),
    firstName: v.pipe(
      v.string("Vui lòng nhập tên"),
      v.nonEmpty("Vui lòng nhập tên"),
    ),
    lastName: v.pipe(
      v.string("Vui lòng nhập họ"),
      v.nonEmpty("Vui lòng nhập họ"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Mật khẩu xác nhận không khớp",
    ),
    ["confirmPassword"],
  ),
);

export type RegisterFormInput = v.InferInput<typeof RegisterSchema>;
export type RegisterOutput = v.InferOutput<typeof RegisterSchema>;
