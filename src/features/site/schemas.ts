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

const positiveDecimal = v.pipe(
  v.string("Số lượng phải là chuỗi"),
  v.nonEmpty("Số lượng không được để trống"),
  v.decimal("Số lượng phải là số"),
  v.check((x) => Number(x) > 0, "Số lượng phải lớn hơn 0"),
);

/** Một dòng định mức trong dialog Sửa định mức. */
export const RequirementLineSchema = v.object({
  materialId: v.pipe(
    v.nullable(v.number()),
    v.transform((x) => x ?? 0),
    v.minValue(1, "Vui lòng chọn vật tư"),
  ),
  quantity: positiveDecimal,
  note: v.optional(v.string(), ""),
});

/** PUT /api/sites/{id}/requirements/ — bulk replace toàn bộ định mức. */
export const RequirementsUpdateSchema = v.object({
  lines: v.array(RequirementLineSchema),
});

/** Một dòng trả về kho khác khi tất toán. */
export const SettleLineSchema = v.object({
  materialId: v.pipe(
    v.nullable(v.number()),
    v.transform((x) => x ?? 0),
    v.minValue(1, "Vui lòng chọn vật tư"),
  ),
  quantity: positiveDecimal,
  note: v.optional(v.string(), ""),
});

/** POST /api/sites/{id}/settle/ — tất toán công trường. */
export const SettleSchema = v.pipe(
  v.object({
    toWarehouseId: v.pipe(
      v.nullable(v.number()),
      v.transform((x) => x ?? 0),
      v.minValue(1, "Vui lòng chọn kho đích"),
    ),
    lines: v.pipe(
      v.array(SettleLineSchema),
      v.minLength(1, "Chọn ít nhất 1 dòng trả về"),
    ),
  }),
  v.check((i) => i.toWarehouseId > 0, "Vui lòng chọn kho đích"),
);
