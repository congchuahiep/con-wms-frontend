# UnitConversion — Page Design

> **v3.0** — Hỗ trợ quy đổi theo vật tư (`material`) trong create/edit dialog

## Bước 0: Xác định loại page

**`dialog`** — Quy đổi hiển thị và quản lý ngay trong Edit Unit Dialog. Không đổi bảng Units chính.

---

## Bước 1: Phân tích UX

| #   | Câu hỏi                       | Trả lời                                                                  |
| --- | ----------------------------- | ------------------------------------------------------------------------ |
| 1   | **Ai dùng?**                  | Admin + Thủ kho: CRUD conversion. Nhân viên khác: chỉ xem (GET)          |
| 2   | **Cần làm gì?**               | Xem/sửa quy đổi. Với unit `material` → chọn vật tư khi tạo quy đổi       |
| 3   | **Dữ liệu hiển thị thế nào?** | Bảng nhỏ trong Edit Dialog: Quy đổi \| Vật tư (nếu material) \| Thao tác |
| 4   | **Có filter/search không?**   | Không (≤ 10 conversions)                                                 |
| 5   | **Form create conversion?**   | Dialog con, thêm field vật tư khi `unit.conversionType === "material"`   |

---

## Bước 2: Mockup ASCII

### Create Conversion Dialog — Unit `material` (BAO)

```
┌──────────────────────────────────────────────────────┐
│  Thêm quy đổi cho đơn vị "Bao"                       │
│                                                      │
│  ┌──────┐           ┌──────────────┐                 │
│  │  1   │ BAO   =   │ 50           │ KG            │  ← factor + toUnit
│  └──────┘           └──────────────┘                 │
│                                                      │
│  Vật tư *                                            │  ← SelectField materialId
│  ┌──────────────────────────────────────────────┐   │
│  │ Xi măng Hà Tiên PCB40                    ▾  │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│                              [Hủy]  [Thêm quy đổi]    │
└──────────────────────────────────────────────────────┘
```

### Create Conversion Dialog — Unit `global` (TAN)

```
┌──────────────────────────────────────────────────────┐
│  Thêm quy đổi cho đơn vị "Tấn"                       │
│                                                      │
│  ┌──────┐           ┌──────────────┐                 │
│  │  1   │ TAN   =   │ 1000         │ KG            │  ← chỉ factor + toUnit
│  └──────┘           └──────────────┘                 │
│                                                      │
│  (không có field Vật tư)                             │
│                                                      │
│                              [Hủy]  [Thêm quy đổi]    │
└──────────────────────────────────────────────────────┘
```

### Edit Conversion Dialog — Unit `material` (BAO)

```
┌──────────────────────────────────────────────────────┐
│  Sửa quy đổi                                         │
│                                                      │
│  ┌──────┐           ┌──────────────┐                 │
│  │  1   │ BAO   =   │ 50           │ KG            │  ← chỉ sửa factor
│  └──────┘           └──────────────┘                 │
│                                                      │
│  Vật tư: Xi măng Hà Tiên PCB40   (read-only)         │  ← hiển thị, không edit
│                                                      │
│                              [Hủy]  [Lưu thay đổi]    │
└──────────────────────────────────────────────────────┘
```

### Edit Unit Dialog — bảng quy đổi (có material)

```
┌──────────────────────────────────────────────────────────┐
│  Sửa đơn vị tính                                         │
│  ... (form code + name + loại quy đổi) ...               │
│                                                          │
│  ── Quy đổi theo vật tư ─────────────────────────────── │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Quy đổi                        │ Vật tư        │   │
│  │ 1 BAO = 50 KG                  │ Xi măng HT... │ ✎🗑│   │
│  │ 1 BAO = 40 KG                  │ Xi măng BS... │ ✎🗑│   │
│  └──────────────────────────────────────────────────┘   │
│  [+ Thêm quy đổi]                                        │
│                                                          │
│                          [Hủy]  [Lưu thay đổi]            │
└──────────────────────────────────────────────────────────┘
```

---

## Bước 3: Component Tree + State Flow

### Cấu trúc file (không đổi so với v2.0, chỉ sửa nội dung)

```
src/app/(app)/units/
├── edit-dialog.tsx             ← ✏️ SỬA: cột hiển thị material
├── create-conversion-dialog.tsx ← ✏️ SỬA: thêm SelectField material
├── edit-conversion-dialog.tsx  ← ✏️ SỬA: hiển thị material read-only
└── (các file cũ giữ nguyên)
```

```
src/features/unit-conversion/
├── types.ts                    ← ✏️ SỬA: material: SimpleMaterial | null
├── schemas.ts                  ← ✏️ SỬA: tách 2 schema
├── services.ts                 ← ✏️ SỬA: useAddConversion nhận conversionType
└── index.ts                    ← giữ nguyên
```

### State flow — Create Conversion

```
CreateConversionDialog (props: { unit })
├── unit.conversionType === "material"?
│   ├── true  → render SelectField materialId
│   │   └── useGetMaterials() → options từ data.items
│   └── false → không render
│
├── useAddConversion(unit.id, unit.conversionType)
│   ├── chọn schema (Global | Material)
│   ├── initialInput (có/không có materialId)
│   └── submit → POST /units/{id}/conversions/
```

### State flow — Edit Conversion

```
EditConversionDialog (props: { conversion })
├── hiển thị factor (sửa được)
├── hiển thị material (read-only, nếu conversion.material != null)
└── useUpdateConversion(conversion.id, conversion.isReverse, { factor })
    → PATCH /unit-conversions/{id}/ (chỉ gửi factor)
```

---

## Bước 4: Component Selection

### Create Conversion Dialog

| UI Element    | Component     | Ghi chú                                                                          |
| ------------- | ------------- | -------------------------------------------------------------------------------- |
| Input factor  | `InputField`  | `noField`, trong `ButtonGroup`                                                   |
| Select toUnit | `SelectField` | options từ `useGetUnits()`                                                       |
| Select vật tư | `SelectField` | **chỉ khi** `unit.conversionType === "material"`; options từ `useGetMaterials()` |
| Error display | `FieldError`  | `getErrors(form, { path: ["materialId"] })`                                      |

**Material options:**

```typescript
const { data: materialsData } = useGetMaterials({ pageSize: 100 });
const materialOptions = useMemo(
    () =>
        (materialsData?.items ?? []).map((m) => ({
            value: String(m.id),
            label: `${m.name}`,
        })),
    [materialsData],
);
```

**Render material selector:**

```tsx
{
    unit.conversionType === "material" && (
        <SelectField
            of={form}
            path={["materialId"]}
            label="Vật tư"
            options={materialOptions}
            transform={(v) => (v === "" ? null : Number(v))}
            placeholder="Chọn vật tư"
            required
        />
    );
}
```

### Edit Conversion Dialog

| UI Element         | Component         | Ghi chú                                         |
| ------------------ | ----------------- | ----------------------------------------------- |
| Input factor       | `InputField`      | editable, trong `InputGroup`                    |
| Vật tư (read-only) | `Field` + `Input` | `readOnly`, value = `conversion.material?.name` |

---

## Bước 5: Chờ duyệt

> **Trạng thái:** 🔵 Chờ user duyệt trước khi code
>
> **Tổng kết thiết kế v3.0:**
>
> - Create Dialog: thêm `SelectField` vật tư khi `conversionType === "material"`
> - Edit Dialog: hiển thị vật tư read-only (không edit sau tạo)
> - Bảng quy đổi: hiển thị tên vật tư
> - Data layer: tách schema + type `SimpleMaterial`
