import * as v from "valibot";

export const OutboundNoteLineSchema = v.object({
  materialId: v.pipe(v.nullable(v.number()), v.transform((x) => x ?? 0), v.minValue(1, "Vui lòng chọn vật tư")),
  quantity: v.pipe(v.string("Số lượng phải là chuỗi"), v.nonEmpty("Số lượng không được để trống"), v.decimal("Số lượng phải là số"), v.check((x) => Number(x) > 0, "Số lượng phải lớn hơn 0")),
  note: v.optional(v.string(), ""),
});

export const OutboundNoteSchema = v.pipe(
  v.object({
    noteType: v.picklist(["issue_for_use", "transfer"], "Loại phiếu không hợp lệ"),
    date: v.pipe(v.string(), v.nonEmpty("Ngày không được để trống"), v.isoDate("Ngày không đúng YYYY-MM-DD")),
    warehouseId: v.pipe(v.nullable(v.number()), v.transform((x) => x ?? 0), v.minValue(1, "Vui lòng chọn kho xuất")),
    siteId: v.nullable(v.number()),
    toWarehouseId: v.nullable(v.number()),
    note: v.optional(v.string(), ""),
    lines: v.pipe(v.array(OutboundNoteLineSchema), v.minLength(1, "Phiếu phải có ít nhất 1 dòng")),
  }),
  v.check((i) => i.noteType !== "issue_for_use" || i.siteId != null, "Xuất cấp phải chọn công trường"),
  v.check((i) => i.noteType !== "transfer" || i.siteId == null, "Điều chuyển không có công trường"),
  v.check((i) => i.noteType !== "transfer" || i.toWarehouseId != null, "Điều chuyển phải chọn kho đích"),
  v.check((i) => i.noteType !== "issue_for_use" || i.toWarehouseId == null, "Xuất cấp không có kho đích"),
  v.check((i) => i.toWarehouseId == null || i.toWarehouseId !== i.warehouseId, "Kho đích phải khác kho xuất"),
);

export const VoidNoteSchema = v.object({
  reason: v.pipe(v.string(), v.nonEmpty("Lý do hủy không được để trống"), v.maxLength(1000, "Tối đa 1000 ký tự")),
});
