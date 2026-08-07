# Page Design — {{PAGE_NAME}} (form)

> Page route: `src/app/(app)/{{ROUTE}}/`
> Feature: [`docs/features/{{FEATURE_NAME}}/`](../{{FEATURE_NAME}}/README.md)
> Type: **form**

## Mockup

```
┌── Header ─────────────────────────────────────────────────┐
│  ← Quay lại                                                │
│  {{TITLE}}                                                 │
├── Content ─────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐│
│  │ {{SECTION_TITLE}}                                       ││
│  │                                                        ││
│  │ {{FIELD_1_LABEL}} *                                     ││
│  │ [________________________________________]             ││
│  │ {{HELP_TEXT}}                                           ││
│  │                                                        ││
│  │ {{FIELD_2_LABEL}} *                                     ││
│  │ [________________________________________]             ││
│  │ ⚠ {{VALIDATION_ERROR_MESSAGE}}                         ││
│  │                                                        ││
│  │ {{FIELD_3_LABEL}}                                       ││
│  │ [▼ {{DEFAULT_OPTION}}]                                  ││
│  │                                                        ││
│  │ {{FIELD_4_LABEL}}                                       ││
│  │ [┌──────────────────────────────────────────────────┐] ││
│  │ [│                                                  │] ││
│  │ [│                                                  │] ││
│  │ [└──────────────────────────────────────────────────┘] ││
│  └────────────────────────────────────────────────────────┘│
├── Footer ──────────────────────────────────────────────────┤
│                               (Hủy)  [+ {{SUBMIT_LABEL}}] │
└────────────────────────────────────────────────────────────┘
```

> `*` = required field, `⚠` = validation error, `()` = outline button, `[]` = primary button

## Cây component

```
{{PageName}}Page
├── {{PageName}}Header
│   ├── Back button "← Quay lại"
│   └── Title
├── {{PageName}}FormSection
│   └── Form (Formisch)
│       ├── InputField         ← path="code", label, required
│       ├── InputField         ← path="name", label, required
│       ├── SelectField        ← path="parentId", label, options
│       │                      ← (sắp có, hiện dùng Select + FormField)
│       └── TextareaField      ← path="note", label, description
└── {{PageName}}PageActions
    ├── Button "Hủy"              ← variant outline
    └── Button "{{SUBMIT}}"       ← variant default, loading state
```

## State Flow

| State | Vị trí (hook / state) | Truyền đến component |
|---|---|---|
| `initialData` | `Page` (từ props hoặc `useGetXxx(id)`) | `Page → Form` |
| `form` | `usePost()` hoặc `useForm()` (Formisch) | `Page → FormSection → InputField, ...` |
| `isPending` | `usePost()` | `Page → PageActions` (loading button) |
| `isError` | `usePost()` | `Page` (toast hoặc inline error) |
| `isSuccess` | `usePost()` | `Page` (redirect hoặc toast) |

## Component Spec

| Component | File | Props |
|---|---|---|
| {{PageName}}Header | `header.tsx` | `title: string`, `backHref?: string` |
| {{PageName}}FormSection | `form-section.tsx` | `form: FormStore<T>` |
| {{PageName}}PageActions | `page-actions.tsx` | `isPending`, `onCancel`, `submitLabel` |

## Form Fields Spec

Mỗi field dùng component từ `@/components/form/`:

| Field | Component | Props chính |
|---|---|---|
| | `InputField` | `of={form}`, `path="..."`, `label="..."`, `required`, `placeholder` |
| | `TextareaField` | `of={form}`, `path="..."`, `label="..."`, `placeholder` |
| | *(sắp có)* `SelectField` | `of={form}`, `path="..."`, `label="..."`, `options` |

## Form Behavior

- **Validation**: Blur + Submit (Formisch mặc định)
- **Loading**: Button submit hiển thị spinner, disabled form
- **Success**: Toast "Đã {{ACTION}} thành công" + redirect về list
- **Error**:
  - Validation: message dưới field (InputField tự hiển thị)
  - Server 400: map vào field (usePost tự xử lý)
  - Server 500: toast error

## Empty / Error States

- **404 (edit mode)**: "Không tìm thấy {{ENTITY}}"
- **Network error**: Toast + giữ nguyên form data
