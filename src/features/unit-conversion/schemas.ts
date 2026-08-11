import * as v from "valibot";

export const ConversionSchema = v.object({
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
