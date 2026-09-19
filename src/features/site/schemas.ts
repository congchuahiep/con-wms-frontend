import * as v from "valibot";

export const SiteSchema = v.object({
  code: v.pipe(
    v.string("Mã công trường phải là chuỗi"),
    v.nonEmpty("Mã công trường không được để trống"),
    v.maxLength(20, "Mã tối đa 20 ký tự"),
    v.regex(/^[a-zA-Z0-9_]+$/, "Mã chỉ chứa chữ, số và _"),
  ),
  name: v.pipe(
    v.string("Tên phải là chuỗi"),
    v.nonEmpty("Tên không được để trống"),
    v.maxLength(200, "Tên tối đa 200 ký tự"),
  ),
  manager: v.optional(v.string(), ""),
  phone: v.optional(v.string(), ""),
  address: v.optional(v.string(), ""),
  note: v.optional(v.string(), ""),
});
