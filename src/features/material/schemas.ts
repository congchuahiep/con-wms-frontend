import * as v from "valibot";

export const MaterialConversionSchema = v.object({
  toUnitId: v.pipe(
    v.nullable(v.number()),
    v.transform((input) => input ?? 0),
    v.minValue(1, "Vui lòng chọn đơn vị đích"),
  ),
  factor: v.pipe(
    v.string(),
    v.toNumber("Hệ số phải là số"),
    v.number("Hệ số phải là số"),
    v.minValue(0.0001, "Hệ số phải lớn hơn 0"),
  ),
});

export const MaterialSchema = v.object({
  code: v.pipe(
    v.string("Mã vật tư phải là chuỗi"),
    v.nonEmpty("Mã vật tư không được để trống"),
    v.maxLength(30, "Mã vật tư tối đa 30 ký tự"),
  ),
  name: v.pipe(
    v.string("Tên vật tư phải là chuỗi"),
    v.nonEmpty("Tên vật tư không được để trống"),
  ),
  categoryId: v.pipe(
    v.nullable(v.number()),
    v.transform((input) => input ?? 0),
    v.minValue(1, "Danh mục không được để trống"),
  ),
  unitId: v.pipe(v.number("Đơn vị tính không được để trống")),
  description: v.optional(v.string(), ""),
  conversions: v.optional(v.array(MaterialConversionSchema), []),
});
