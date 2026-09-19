import * as v from "valibot";
export const StocktakeLineSchema = v.object({
  materialId: v.pipe(v.nullable(v.number()), v.transform((x) => x ?? 0), v.minValue(1, "Vui lòng chọn vật tư")),
  difference: v.pipe(v.string(), v.nonEmpty("Chênh lệch không được để trống"), v.decimal("Chênh lệch phải là số"), v.check((x) => Number(x) !== 0, "Chênh lệch phải khác 0")),
  reason: v.pipe(v.string(), v.nonEmpty("Lý do không được để trống")),
  note: v.optional(v.string(), ""),
});
export const StocktakeNoteSchema = v.object({
  date: v.pipe(v.string(), v.nonEmpty("Ngày không được để trống"), v.isoDate("Ngày không đúng YYYY-MM-DD")),
  warehouseId: v.pipe(v.nullable(v.number()), v.transform((x) => x ?? 0), v.minValue(1, "Vui lòng chọn kho")),
  note: v.optional(v.string(), ""),
  lines: v.pipe(v.array(StocktakeLineSchema), v.minLength(1, "Phiếu phải có ít nhất 1 dòng")),
});
export const VoidNoteSchema = v.object({ reason: v.pipe(v.string(), v.nonEmpty("Lý do hủy không được để trống"), v.maxLength(1000, "Tối đa 1000 ký tự")) });
