import * as v from "valibot";

export const CategorySchema = v.object({
  code: v.pipe(
    v.string("Mã danh mục phải là chuỗi"),
    v.nonEmpty("Mã danh mục không được để trống"),
    v.regex(
      /^[a-zA-Z0-9_]+$/,
      "Mã danh mục chỉ được chứa chữ cái, số và dấu gạch dưới",
    ),
    v.maxLength(50, "Mã danh mục tối đa 50 ký tự"),
  ),
  name: v.pipe(
    v.string("Tên danh mục phải là chuỗi"),
    v.nonEmpty("Tên danh mục không được để trống"),
    v.maxLength(200, "Tên danh mục tối đa 200 ký tự"),
  ),
  description: v.optional(v.string(), ""),
  color: v.optional(v.nullable(v.string()), null),
  parentId: v.optional(v.nullable(v.number()), null),
});
