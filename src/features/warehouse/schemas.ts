import * as v from "valibot";

export const WarehouseSchema = v.object({
  code: v.pipe(
    v.string("Mã kho phải là chuỗi"),
    v.nonEmpty("Mã kho không được để trống"),
    v.regex(
      /^[a-zA-Z0-9_]+$/,
      "Mã kho chỉ được chứa chữ cái, số và dấu gạch dưới",
    ),
    v.maxLength(20, "Mã kho tối đa 20 ký tự"),
  ),
  name: v.pipe(
    v.string("Tên kho phải là chuỗi"),
    v.nonEmpty("Tên kho không được để trống"),
    v.maxLength(200, "Tên kho tối đa 200 ký tự"),
  ),
  address: v.optional(v.string(), ""),
  note: v.optional(v.string(), ""),
  latitude: v.optional(v.nullable(v.number()), null),
  longitude: v.optional(v.nullable(v.number()), null),
});
