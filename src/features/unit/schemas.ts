import * as v from "valibot";

export const UnitSchema = v.object({
  code: v.pipe(
    v.string("Mã đơn vị phải là chuỗi"),
    v.nonEmpty("Mã đơn vị không được để trống"),
    v.regex(
      /^[a-zA-Z0-9_]+$/,
      "Mã đơn vị chỉ được chứa chữ cái, số và dấu gạch dưới",
    ),
    v.maxLength(10, "Mã đơn vị tối đa 10 ký tự"),
  ),
  name: v.pipe(
    v.string("Tên đơn vị phải là chuỗi"),
    v.nonEmpty("Tên đơn vị không được để trống"),
    v.maxLength(100, "Tên đơn vị tối đa 100 ký tự"),
  ),
});
