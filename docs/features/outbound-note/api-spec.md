# API Spec — Outbound Note

| Method | Endpoint                       | Body                                                                         |
| ------ | ------------------------------ | ---------------------------------------------------------------------------- |
| GET    | /api/outbound-notes/           | query note_type, status, warehouse, to_warehouse, site, date_from/to, search |
| POST   | /api/outbound-notes/           | OutboundNoteInput → 201 draft                                                |
| GET    | /api/outbound-notes/{id}/      | detail kèm lines                                                             |
| PUT    | /api/outbound-notes/{id}/      | replace-all lines (draft only)                                               |
| DELETE | /api/outbound-notes/{id}/      | draft only                                                                   |
| POST   | /api/outbound-notes/{id}/post/ | chốt (check tồn)                                                             |
| POST   | /api/outbound-notes/{id}/void/ | {reason}                                                                     |

List phân trang page_size=20, item không kèm lines.
