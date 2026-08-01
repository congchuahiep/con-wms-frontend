# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

| Vai trò               | SL  | Nhiệm vụ chính                          |
| --------------------- | --- | --------------------------------------- |
| Quản lý (chủ công ty) | 1   | Xem báo cáo/dashboard, ra quyết định    |
| Thủ kho               | 1–2 | Nhập/xuất/kiểm kê, điều chỉnh tồn       |
| Chủ nhiệm công trình  | 2–3 | Đề xuất xuất vật tư, theo dõi xuất dùng |
| Kế toán               | 1   | Xem lịch sử giao dịch với NCC           |
| Admin hệ thống         | 1   | Quản trị user, danh mục                 |

**Lưu ý quan trọng:** Thủ kho có thể ≥ 45 tuổi, ít tin học — UI phải lớn, ít nút, có phím tắt (Enter để xuống dòng tiếp theo khi nhập phiếu).

## Product Purpose

`con-wms` là hệ thống quản lý vật tư (WMS) thay thế sổ sách/Excel cho công ty xây dựng địa phương quy mô ~10 người. Giúp: lưu trữ danh mục vật tư, quản lý nhiều kho có định vị, ghi nhanh nhập/xuất bằng đầu đọc barcode USB HID, quản lý nhà cung cấp kèm lịch sử giao dịch, kiểm kê nhanh để điều chỉnh tồn thực tế.

Mục tiêu: giảm thời gian ghi nhận nhập/xuất xuống < 30 giây/phiếu; độ chính xác sổ sách ≥ 99%; chạy 100% trên máy văn phòng, không cần cài đặt app, không cần internet ngoài.

## Positioning

WMS đơn giản hóa cho doanh nghiệp xây dựng nhỏ — không cần internet, chạy trên LAN nội bộ. Dùng đầu đọc barcode USB HID kiểu siêu thị (giả lập bàn phím, gõ thẳng vào ô input) thay vì PDA Android đắt tiền. UI phù hợp người ít tin học. Thủ kho tự điều chỉnh tồn không cần xét duyệt — phù hợp quy mô nhỏ.

## Operating Context

- Mạng LAN nội bộ công ty, không yêu cầu kết nối internet.
- Chạy trên 1 máy chủ văn phòng (Windows hoặc Linux), Docker Compose tùy chọn.
- Phiên đồng thời tối đa ~5 người, giờ hành chính.
- Đầu đọc barcode USB HID (giả lập bàn phím) là thiết bị nhập chính cho thủ kho.
- Người dùng truy cập qua trình duyệt web trên máy văn phòng.

## Capabilities and Constraints

### In-scope (5 chức năng cốt lõi)

- **F1 — Quản lý vật tư + Nhập/Xuất + Barcode:** Danh mục vật tư (mã SKU, tên, đơn vị tính, quy cách, nhóm 2 cấp). Phiếu nhập (mua, hoàn trả) và xuất (sử dụng, điều chuyển). Quét barcode USB HID để thêm dòng phiếu nhanh.
- **F2 — Quản lý nhà cung cấp:** Thông tin liên hệ NCC, lịch sử giao dịch tự tổng hợp từ phiếu nhập mua.
- **F3 — Quản lý nhà kho:** Nhiều kho, cấu trúc vị trí 5 cấp (Kho → Khu vực → Kệ → Tầng → Ô). Gán vị trí khi nhập, di chuyển nội bộ.
- **F4 — Kiểm kê:** Tạo phiếu kiểm kê theo kho/nhóm/khu vực. Quét/đếm thực tế, tự tính chênh lệch. Thủ kho tự điều chỉnh tồn kèm lý do.
- **F5 — Báo cáo & Dashboard:** Tồn kho hiện tại + giá trị (giá nhập gần nhất), nhập-xuất-tồn kỳ, lịch sử NCC, top vật tư xuất nhiều/tồn lâu, dashboard 1 trang cho quản lý.

### Out-of-scope (bản đầu)

- Purchase Order / báo giá NCC
- Quản lý công cụ/dụng cụ phát mượn
- Lô / hạn sử dụng / FIFO/LIFO/FEFO
- App mobile native
- Offline-first sync
- Đa ngôn ngữ (chỉ tiếng Việt)
- Email/SMS thông báo

### Kỹ thuật

- **Frontend:** Next.js (App Router) + React 19 + TailwindCSS v4 + Base UI + TanStack Query
- **Backend:** Django 6 + DRF + SQLite (sẵn sàng chuyển PostgreSQL)
- **Auth:** JWT, 4 roles (admin / thủ kho / chủ nhiệm / kế toán)
- **Nhập liệu:** Barcode USB HID gõ thẳng vào ô input; phản hồi < 100ms sau quét
- **Hiệu năng:** Phiếu ≤ 50 dòng load < 1.5s
- **Ngôn ngữ:** Tiếng Việt

### Ưu tiên (MoSCoW)

- **Must:** F1, F3, F5 (tồn kho hiện tại + dashboard)
- **Should:** F2, F4
- **Could:** Báo cáo nhập-xuất-tồn kỳ, di chuyển vị trí nội bộ
- **Won't (bản đầu):** PO, lô/FEFO, app mobile, duyệt phiếu

## Brand Commitments

Chưa có tài sản thương hiệu cụ thể (logo, guideline, tên công ty). Cần xác nhận từ chủ công ty trước khi thiết kế visual identity.

## Evidence on Hand

- Project Charter v0.1 (đầy đủ scope, users, constraints, MoSCoW, milestones)
- Codebase: Next.js scaffold với Button component (Base UI), QueryProvider, Tailwind v4, shadcn

## Product Principles

1. **Tốc độ thao tác là trên hết** — Quét barcode là phương thức nhập chính; gõ tay là phụ. Mọi thao tác thường xuyên phải hoàn thành trong vài giây.
2. **Đơn giản cho người ít tin học** — UI to, rõ, ít nút, phím tắt nhất quán (Enter để xuống dòng). Không giả định người dùng biết dùng máy tính thành thạo.
3. **Chính xác sổ sách** — Mọi thay đổi tồn đều được ghi log. Kiểm kê là công dân hạng nhất, không phải tính năng phụ.
4. **Tự chủ, không phụ thuộc internet** — Toàn bộ hệ thống chạy trên LAN. Không có external dependency nào cản trở công việc trong giờ hành chính.
5. **Thực tế, không over-engineering** — Quy mô 10 người, 5 phiên đồng thời. Không cần high-concurrency, microservices, hay multi-tenancy. Làm đúng, làm gọn.

## Accessibility & Inclusion

- Thủ kho ≥ 45 tuổi, ít tin học → UI cỡ chữ lớn, target touch đủ rộng, navigation đơn giản.
- Hỗ trợ phím tắt bàn phím cho toàn bộ luồng nhập phiếu (không cần chuột).
- Tiếng Việt toàn bộ giao diện.
