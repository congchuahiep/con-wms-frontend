import * as v from "valibot";

export const SupplierSchema = v.object({
  code: v.pipe(
    v.string("Mã NCC phải là chuỗi"),
    v.nonEmpty("Mã NCC không được để trống"),
    v.regex(
      /^[a-zA-Z0-9_]+$/,
      "Mã NCC chỉ được chứa chữ cái, số và dấu gạch dưới",
    ),
    v.maxLength(20, "Mã NCC tối đa 20 ký tự"),
  ),
  name: v.pipe(
    v.string("Tên NCC phải là chuỗi"),
    v.nonEmpty("Tên NCC không được để trống"),
    v.maxLength(200, "Tên NCC tối đa 200 ký tự"),
  ),
  taxCode: v.optional(v.string(), ""),
  contactPerson: v.optional(v.string(), ""),
  phone: v.optional(v.string(), ""),
  email: v.optional(
    v.union([
      v.literal(""),
      v.pipe(
        v.string("Email phải là chuỗi"),
        v.email("Email không đúng định dạng"),
      ),
    ]),
    "",
  ),
  address: v.optional(v.string(), ""),
  note: v.optional(v.string(), ""),
});
