# Page Design — Notes (Chứng từ kho)

> **Status:** 🔵 Đang thiết kế — chờ user duyệt trước khi code.
> Page tham khảo: `src/app/(app)/inbound-notes/` (copy cấu trúc này cho mỗi loại).

## 1. Phạm vi

| #   | Thành phần                       | Loại     | Trạng thái          |
| --- | -------------------------------- | -------- | ------------------- |
| H1  | Hub `/notes` — 3 card loại phiếu | overview | 🔵 Thiết kế         |
| L1  | `/notes/inbound` — page độc lập  | `table`  | 🔵 Thiết kế         |
| L2  | `/notes/outbound`                | `table`  | ⏸ Phụ thuộc backend |
| L3  | `/notes/stocktake`               | `table`  | ⏸ Phụ thuộc backend |

## 2. H1 — Hub `/notes`

### Mockup (pha 1 — không stats)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Chứng từ kho                                                              │
│ Quản lý phiếu nhập kho, xuất kho và kiểm kê                              │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  📥 Nhập kho     │  │  📤 Xuất kho     │  │  🔍 Kiểm kê     │           │
│  │                 │  │                 │  │                 │           │
│  │ [Xem danh sách] │  │ [Xem danh sách] │  │ [Xem danh sách] │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└──────────────────────────────────────────────────────────────────────────┘
```

- Cả card clickable → `/notes/inbound`, `/notes/outbound`, `/notes/stocktake`.
- Pha 2 thêm `total` / `draft` khi có stats endpoint.

## 3. Page mỗi loại `/notes/<type>`

### Mockup (dùng cho cả 3 loại)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ [Nhập kho]  [Xuất kho]  [Kiểm kê]                                         │  ← NoteTypeTabs
│ ───────────────────────────────────────────────────────────────────────── │
│ Chứng từ kho — Nhập kho                                [+ Tạo phiếu nhập] │
│ ───────────────────────────────────────────────────────────────────────── │
│ [ Nháp ]  [ Đã chốt ]  [ Đã hủy ]                                          │  ← NoteStatusTabs
│ ───────────────────────────────────────────────────────────────────────── │
│ (Filter bar riêng theo loại)                                               │
│ ───────────────────────────────────────────────────────────────────────── │
│  ▸ Số phiếu   Ngày      Loại   Kho     NCC    Số loại hàng  Thành tiền ... │
│  ...                                                                       │
│ ───────────────────────────────────────────────────────────────────────── │
│ Footer: tổng + pagination                                                  │
└───────────────────────────────────────────────────────────────────────────┘
```

### Cấu trúc file (copy từ `inbound-notes`, mỗi loại một bản)

```
src/app/(app)/notes/inbound/
├── page.tsx
├── header.tsx
├── filter-bar.tsx          ← bỏ status Select (đã có NoteStatusTabs)
├── columns.tsx             ← bỏ cột Trạng thái, giữ các cột còn lại
├── table-section.tsx
├── footer.tsx
├── use-inbound-params.ts   ← thêm status như inbound hiện tại
└── (create/edit/detail/void dialogs — reuse feature inbound-note)
```

`outbound/` và `stocktake/` dựng tương tự khi có feature riêng.

## 4. Component tree (per-type)

```
<Type>NotesPage (page.tsx — độc lập)
├── NoteTypeTabs            (shared, active theo route)
├── Header                  (title + total + create action)
├── NoteStatusTabs          (shared, ?status=)
├── FilterBar               (per-type)
├── TableSection            (DataTable + columns per-type)
├── Footer                  (pagination)
└── Dialogs                 (per-type)
```

## 5. State / URL flow

```
/notes/inbound?status=draft&warehouse=3&page=1
      └──── type = route segment
                └──── status/filter/page = search params
```

- Mỗi type có `useXxxParams()` riêng (giống `useInboundNoteParams`).
- `NoteTypeTabs` đổi route **giữ `status`**; reset các filter khác không còn hợp lệ với type mới.

## 6. Components

| UI          | Component                     |
| ----------- | ----------------------------- |
| Type tabs   | `NoteTypeTabs` (shared)       |
| Status tabs | `NoteStatusTabs` (shared)     |
| Card hub    | `Card` / `Button` (clickable) |
| Table       | `DataTable`                   |
| Dialogs     | per-type                      |

## 7. Open questions

| #   | Câu hỏi                                                           |
| --- | ----------------------------------------------------------------- |
| Q1  | Hub pha 1 không có stats — chấp nhận card trống số chứ?           |
| Q2  | Type tabs đặt trên cùng (trên header) — OK?                       |
| Q3  | Khi chuyển type: giữ `status`, reset `page`/`search`/filter — OK? |
