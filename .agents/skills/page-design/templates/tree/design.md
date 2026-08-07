# Page Design — {{PAGE_NAME}} (tree)

> Page route: `src/app/(app)/{{ROUTE}}/`
> Feature: [`docs/features/{{FEATURE_NAME}}/`](../{{FEATURE_NAME}}/README.md)
> Type: **tree**

## Mockup

```
┌── Header ─────────────────────────────────────────────────┐
│  [Icon] {{TITLE}}                   (Xuất CSV)  [+ {{ACTION}}] │
│  {{STATS_TEXT}}                                              │
├── Filter Bar ──────────────────────────────────────────────┤
│  [🔍 {{SEARCH_PLACEHOLDER}}]                                │
├── Content ─────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐│
│  │ ▶ {{ROOT_1}}                                            ││
│  │   ├── 📁 {{CHILD_1_1}}     [{{TAG_1}}]  [✏️] [🗑️]      ││
│  │   ├── 📁 {{CHILD_1_2}}     [{{TAG_2}}]  [✏️] [🗑️]      ││
│  │   │   └── 📁 {{GRANDCHILD}} [{{TAG_3}}]  [✏️] [🗑️]      ││
│  │   └── 📁 {{CHILD_1_3}}     [{{TAG_4}}]  [✏️] [🗑️]      ││
│  │ ▶ {{ROOT_2}}                                            ││
│  │   └── 📁 {{CHILD_2_1}}     [{{TAG_5}}]  [✏️] [🗑️]      ││
│  └────────────────────────────────────────────────────────┘│
├── Footer ──────────────────────────────────────────────────┤
│  {{COUNT}} danh mục                                        │
└────────────────────────────────────────────────────────────┘

┌── Create Dialog (modal) ──────────────────────────────────┐
│  Tạo {{ENTITY}} mới                          [✕]          │
│  ┌────────────────────────────────────────────────────────┐│
│  │ {{FIELD_1}}  [________________________]                ││
│  │ {{FIELD_2}}  [________________________]                ││
│  │ {{FIELD_3}}  [▼ (Không có)]                            ││
│  └────────────────────────────────────────────────────────┘│
│                           (Hủy)  [+ Tạo {{ENTITY}}]       │
└────────────────────────────────────────────────────────────┘
```

> `▶` = expanded, `▼` = collapsed, `()` = outline/disabled button, `[]` = primary button

## Cây component

```
{{PageName}}Page
├── {{PageName}}Header
│   ├── Icon + Title + Stats
│   └── Button "Thêm mới"           ← variant default, size sm
├── {{PageName}}FilterBar (nếu có search)
│   └── Input (search)
├── {{PageName}}TreeSection
│   └── TreeList
│       └── TreeNode (đệ quy)
│           ├── Expand/Collapse toggle
│           ├── Badge (color tag)
│           ├── Label (tên node)
│           ├── Child count
│           └── Actions: Edit, Delete
├── {{PageName}}Footer
│   └── Tổng số node
└── Dialogs (conditional)
    ├── Create{{Entity}}Dialog      ← Form tạo mới
    └── Edit{{Entity}}Dialog        ← Form chỉnh sửa
```

## State Flow

| State          | Vị trí (hook / state)                  | Truyền đến component            |
| -------------- | -------------------------------------- | ------------------------------- |
| `data` (tree)  | `useGetXxx()`                          | `Page → TreeSection → TreeNode` |
| `search`       | `Page` (`useState`)                    | `Page → FilterBar`              |
| `filteredData` | `Page` (`useMemo`, filter tree đệ quy) | `Page → TreeSection`            |
| `expandedIds`  | `Page` (`useState<Set<number>>`)       | `Page → TreeSection → TreeNode` |
| `dialogOpen`   | `Page` (`useState`)                    | `Page → CreateDialog`           |
| `editNode`     | `Page` (`useState<T \| null>`)         | `Page → EditDialog`             |
| `form`         | `usePost()` (Formisch)                 | `CreateDialog → Form`           |

## Component Spec

| Component               | File                | Props                                                                       |
| ----------------------- | ------------------- | --------------------------------------------------------------------------- |
| {{PageName}}Header      | `header.tsx`        | `totalNodes: number`                                                        |
| {{PageName}}FilterBar   | `filter-bar.tsx`    | `search: string`, `onSearchChange`                                          |
| {{PageName}}TreeSection | `tree-section.tsx`  | `nodes: T[]`, `expandedIds`, `onToggle`, `onEdit`, `onDelete`               |
| TreeNode                | `tree-node.tsx`     | `node: T`, `depth: number`, `expandedIds`, `onToggle`, `onEdit`, `onDelete` |
| {{PageName}}Footer      | `footer.tsx`        | `totalNodes: number`                                                        |
| Create{{Entity}}Dialog  | `create-dialog.tsx` | `open`, `onOpenChange`, parent options                                      |
| Edit{{Entity}}Dialog    | `edit-dialog.tsx`   | `open`, `onOpenChange`, `node: T`                                           |

## Tree Behavior

- **Expand/Collapse**: Click `▶`/`▼` để mở/đóng node con
- **Depth indentation**: `paddingLeft = depth * 24px`
- **Search filter**: Lọc đệ quy, tự expand node khớp
- **Inline actions**: Edit (✏️) và Delete (🗑️) hiển thị khi hover row

## Empty / Error States

- **Empty**: "Chưa có danh mục nào. Nhấn [+ Thêm mới] để tạo."
- **Error**: Toast error (global handling có sẵn)
