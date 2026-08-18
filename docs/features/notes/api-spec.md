# API Spec — Notes (Chứng từ kho)

Shell `/notes` **không** có API riêng — nó delegate hoàn toàn cho service của từng loại phiếu.

## 1. Inbound note (đã có)

Tham chiếu: `docs/features/inbound-note/api-spec.md`.

| Method | Endpoint                    | Purpose                            |
| ------ | --------------------------- | ---------------------------------- |
| GET    | `/inbound-notes/`           | list (filter `status`, phân trang) |
| POST   | `/inbound-notes/`           | tạo phiếu nháp                     |
| GET    | `/inbound-notes/{id}/`      | detail + lines                     |
| PUT    | `/inbound-notes/{id}/`      | sửa phiếu nháp (replace-all)       |
| DELETE | `/inbound-notes/{id}/`      | xóa phiếu nháp                     |
| POST   | `/inbound-notes/{id}/post/` | chốt phiếu                         |
| POST   | `/inbound-notes/{id}/void/` | hủy phiếu (bắt buộc lý do)         |

## 2. Outbound / Stocktake (chưa có)

Backend entity docs `docs/entities/outbound-note` và `docs/entities/stocktake` hiện **trống** → chưa có endpoint để frontend consume.

| Loại           | Trạng thái API |
| -------------- | -------------- |
| Outbound note  | ⏸ TBD          |
| Stocktake note | ⏸ TBD          |

## 3. Stats cho hub `/notes` (defer)

Hub cần dữ liệu dạng:

```ts
type NoteStats = {
    inbound: { total: number; draft: number };
    outbound: { total: number; draft: number };
    stocktake: { total: number; draft: number };
};
```

- **Pha 1**: card hub không hiển thị số (chỉ icon + tên + link).
- **Pha 2**: thêm endpoint `GET /notes/stats/` (hoặc aggregate client bằng 3 query `pageSize: 1` đọc `meta.total`).
