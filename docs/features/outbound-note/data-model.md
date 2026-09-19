# Data Model — Outbound Note

Nguồn: docs/entities/outbound-note/model.md + api.md — đối xứng inbound-note, khác: không có unitPrice, có transfer 2 dòng sổ kho, site/toWarehouse điều kiện theo noteType.

Types: OutboundNoteType="issue_for_use"|"transfer", OutboundNoteStatus, OutboundNote, OutboundNoteLine, OutboundNoteDetail, OutboundNoteLineInput {materialId, quantity}, OutboundNoteInput {noteType, date, warehouseId, siteId, toWarehouseId, note, lines}, GetOutboundNotesParams.

Schemas: OutboundNoteLineSchema (materialId, quantity>0), OutboundNoteSchema với v.check điều kiện site/toWarehouse theo noteType (copy pattern inbound-note D2), VoidNoteSchema.

Utils: NOTE_STATUS_COLOR_MAP, toOutboundNoteInput helper.

## Chi tiết types — xem inbound-note/data-model.md làm mẫu
