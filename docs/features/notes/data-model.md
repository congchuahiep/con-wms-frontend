# Data Model — Notes (Chứng từ kho)

**Không tạo data layer dùng chung.** Mỗi loại phiếu là một feature độc lập, giống `inbound-note` hiện tại.

## 1. Nguyên tắc

- Mỗi page `/notes/<type>` tự chứa data + UI, tham chiếu `features/<type>-note`.
- **Không** tạo `NoteListConfig`, `NoteListPage`, registry, hay extract status/color map dùng chung.
- Chỉ có 2 component UI dùng chung (thuần UI, không chứa data/API).

## 2. Component UI dùng chung

### `NoteTypeTabs`

```ts
type NoteTypeTabsProps = {
    activeType: "inbound" | "outbound" | "stocktake";
};
```

Render 3 link điều hướng:

| Label    | Href               |
| -------- | ------------------ |
| Nhập kho | `/notes/inbound`   |
| Xuất kho | `/notes/outbound`  |
| Kiểm kê  | `/notes/stocktake` |

Active xác định bằng `usePathname()`.

### `NoteStatusTabs`

```ts
type NoteStatusTabsProps = {
    status: string | null;
    onStatusChange: (status: string | null) => void;
};
```

Render 3 button:

| Value    | Label   |
| -------- | ------- |
| `draft`  | Nháp    |
| `posted` | Đã chốt |
| `voided` | Đã hủy  |

## 3. Data layer theo từng loại (mỗi loại tự quản lý)

| Page               | Feature folder            | Status type           |
| ------------------ | ------------------------- | --------------------- |
| `/notes/inbound`   | `features/inbound-note`   | `InboundNoteStatus`   |
| `/notes/outbound`  | `features/outbound-note`  | `OutboundNoteStatus`  |
| `/notes/stocktake` | `features/stocktake-note` | `StocktakeNoteStatus` |

Mỗi feature tự có `types.ts` / `utils.ts` / `schemas.ts` / `services.ts` / `index.ts` theo chuẩn của repo.
