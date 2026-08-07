# Page Design — {{PAGE_NAME}} (table)

> Page route: `src/app/(app)/{{ROUTE}}/`
> Feature: [`docs/features/{{FEATURE_NAME}}/`](../{{FEATURE_NAME}}/README.md)
> Type: **table**

## Mockup

```
┌── Header ─────────────────────────────────────────────────┐
│  [Icon] {{TITLE}}                   (Xuất CSV)  [+ {{ACTION}}] │
│  {{STATS_TEXT}}                                              │
├── Filter Bar ──────────────────────────────────────────────┤
│  [{{FILTER_LABEL}}: ▼ {{FILTER_DEFAULT}}]    [🔍 {{SEARCH_PLACEHOLDER}}] │
├── Content ─────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐│
│  │ {{COL_1}}  │ {{COL_2}}    │ {{COL_3}}  │ {{COL_4}}  │ ...││
│  ├────────────┼──────────────┼───────────┼────────────┼────┤│
│  │ {{ROW_1_V1}}│ {{ROW_1_V2}} │ {{ROW_1_V3}}│ {{ROW_1_V4}}│ ...││
│  │ {{ROW_2_V1}}│ {{ROW_2_V2}} │ {{ROW_2_V3}}│ {{ROW_2_V4}}│ ...││
│  │ {{ROW_3_V1}}│ {{ROW_3_V2}} │ {{ROW_3_V3}}│ {{ROW_3_V4}}│ ...││
│  └────────────────────────────────────────────────────────┘│
├── Footer ──────────────────────────────────────────────────┤
│  {{FILTERED}} / {{TOTAL}} dòng               ◀ {{PAGE}} / {{TOTAL_PAGES}} ▶ │
└────────────────────────────────────────────────────────────┘

┌── Create Dialog (modal) ──────────────────────────────────┐
│  Tạo {{ENTITY}} mới                          [✕]          │
│  ┌────────────────────────────────────────────────────────┐│
│  │ {{FIELD_1}}  [________________________]                ││
│  │ {{FIELD_2}}  [________________________]                ││
│  │ {{FIELD_3}}  [▼ {{DEFAULT_VALUE}}]                     ││
│  └────────────────────────────────────────────────────────┘│
│                           (Hủy)  [+ Tạo {{ENTITY}}]       │
└────────────────────────────────────────────────────────────┘
```

> `()` = outline/disabled button, `[]` = primary button, `[▼ ...]` = select/dropdown

## Cây component

```
{{PageName}}Page
├── {{PageName}}Header
│   ├── Icon + Title + Stats
│   ├── Button "Xuất CSV"          ← variant outline, size sm, disabled
│   └── Button "Thêm mới"           ← variant default, size sm
├── {{PageName}}FilterBar
│   ├── Select (category filter)    ← left side
│   └── Input (search)              ← right side
├── {{PageName}}TableSection
│   └── DataTable
│       ├── Column: {{COL_1}}       ← font-mono text-xs (nếu là code/ID)
│       ├── Column: {{COL_2}}       ← font-medium (nếu là tên chính)
│       ├── Column: {{COL_3}}       ← Badge variant secondary
│       ├── Column: {{COL_4}}
│       └── Column: {{COL_5}}       ← text-muted-foreground
├── {{PageName}}Footer
│   └── DataTablePagination
└── Dialogs (conditional)
    ├── Create{{Entity}}Dialog      ← Form tạo mới
    └── Edit{{Entity}}Dialog        ← Form chỉnh sửa
```

## State Flow

| State          | Vị trí (hook / state)           | Truyền đến component                 |
| -------------- | ------------------------------- | ------------------------------------ |
| `data`         | `useGetXxx()` (TanStack Query)  | `Page → TableSection → DataTable`    |
| `isLoading`    | `useGetXxx()`                   | `Page` (hiển thị skeleton / loading) |
| `error`        | `useGetXxx()`                   | `Page` (hiển thị error state)        |
| `search`       | `useDataTable` → `globalFilter` | `Page → FilterBar`                   |
| `activeFilter` | `Page` (`useState`)             | `Page → FilterBar`                   |
| `filteredData` | `Page` (`useMemo`)              | `Page → useDataTable`                |
| `table`        | `useDataTable`                  | `Page → TableSection, Footer`        |
| `dialogOpen`   | `Page` (`useState`)             | `Page → CreateDialog`                |
| `form`         | `usePost()` (Formisch)          | `CreateDialog → Form`                |

## Component Spec

| Component                | File                | Props                                                        |
| ------------------------ | ------------------- | ------------------------------------------------------------ |
| {{PageName}}Header       | `header.tsx`        | `totalItems: number`                                         |
| {{PageName}}FilterBar    | `filter-bar.tsx`    | `activeFilter`, `onFilterChange`, `search`, `onSearchChange` |
| {{PageName}}TableSection | `table-section.tsx` | `table: Table<T>`                                            |
| {{PageName}}Footer       | `footer.tsx`        | `table: Table<T>`                                            |
| Create{{Entity}}Dialog   | `create-dialog.tsx` | `open: boolean`, `onOpenChange: (open: boolean) => void`     |

## Column Definitions

| Cột | Header | Accessor | Cell render | Ghi chú |
| --- | ------ | -------- | ----------- | ------- |
|     |        |          |             |         |

## Empty / Error States

- **Empty**: DataTable hiển thị row "Không tìm thấy dữ liệu"
- **Error**: Toast error (global error handling có sẵn)
