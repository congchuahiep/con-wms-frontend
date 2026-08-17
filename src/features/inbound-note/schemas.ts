import * as v from "valibot";

export const InboundNoteLineSchema = v.object({
  materialId: v.pipe(
    v.nullable(v.number()),
    v.transform((input) => input ?? 0),
    v.minValue(1, "Vui lòng chọn vật tư"),
  ),
  quantity: v.pipe(
    v.string("Số lượng phải là chuỗi"),
    v.nonEmpty("Số lượng không được để trống"),
    v.decimal("Số lượng phải là số"),
    v.check((input) => Number(input) > 0, "Số lượng phải lớn hơn 0"),
  ),
  unitPrice: v.pipe(
    v.string("Đơn giá phải là chuỗi"),
    v.nonEmpty("Đơn giá không được để trống"),
    v.decimal("Đơn giá phải là số"),
    v.check((input) => Number(input) >= 0, "Đơn giá không được âm"),
  ),
  note: v.optional(v.string(), ""),
});

/**
 * Body POST/PUT — nested write (phiếu + lines).
 * Cross-field checks theo backend D3: purchase bắt buộc supplier, return_from_site cấm supplier.
 * Dùng `v.pipe(v.object(...), v.check(...))` vì valibot v1 không nhận pipeline array ở arg 2 của `v.object`.
 */
export const InboundNoteSchema = v.pipe(
  v.object({
    noteType: v.picklist(
      ["purchase", "return_from_site"],
      "Loại phiếu không hợp lệ",
    ),
    date: v.pipe(
      v.string("Ngày nhập phải là chuỗi"),
      v.nonEmpty("Ngày nhập không được để trống"),
      v.isoDate("Ngày nhập không đúng định dạng YYYY-MM-DD"),
    ),
    warehouseId: v.pipe(
      v.nullable(v.number()),
      v.transform((input) => input ?? 0),
      v.minValue(1, "Vui lòng chọn kho"),
    ),
    supplierId: v.nullable(v.number()),
    note: v.optional(v.string(), ""),
    lines: v.pipe(
      v.array(InboundNoteLineSchema),
      v.minLength(1, "Phiếu phải có ít nhất 1 dòng"),
    ),
  }),
  v.check(
    (input) => input.noteType !== "purchase" || input.supplierId != null,
    "Phiếu nhập mua phải chọn nhà cung cấp",
  ),
  v.check(
    (input) =>
      input.noteType !== "return_from_site" || input.supplierId == null,
    "Phiếu nhập hàng công trường trả lại không có nhà cung cấp",
  ),
);

/** Body POST /{id}/void/ — hủy phiếu bắt buộc lý do. */
export const VoidNoteSchema = v.object({
  reason: v.pipe(
    v.string("Lý do hủy phải là chuỗi"),
    v.nonEmpty("Lý do hủy không được để trống"),
    v.maxLength(1000, "Lý do hủy tối đa 1000 ký tự"),
  ),
});
