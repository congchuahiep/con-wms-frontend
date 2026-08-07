# Page Design — {{PAGE_NAME}} (cards)

> Page route: `src/app/(app)/{{ROUTE}}/`
> Feature: [`docs/features/{{FEATURE_NAME}}/`](../{{FEATURE_NAME}}/README.md)
> Type: **cards**

## Mockup

```
┌── Header ─────────────────────────────────────────────────┐
│  [Icon] {{TITLE}}                          [+ {{ACTION}}] │
│  {{STATS_TEXT}}                                              │
├── Filter Bar ──────────────────────────────────────────────┤
│  [{{FILTER_LABEL}}: ▼ {{FILTER_DEFAULT}}]    [🔍 {{SEARCH_PLACEHOLDER}}] │
├── Content ─────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ [Icon]       │ │ [Icon]       │ │ [Icon]       │       │
│  │ {{CARD_TITLE}}│ │ {{CARD_TITLE}}│ │ {{CARD_TITLE}}│       │
│  │ {{SUBTITLE}} │ │ {{SUBTITLE}} │ │ {{SUBTITLE}} │       │
│  │              │ │              │ │              │       │
│  │ [{{TAG_1}}]  │ │ [{{TAG_2}}]  │ │ [{{TAG_3}}]  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│  ┌──────────────┐ ┌──────────────┐                        │
│  │ [Icon]       │ │ [Icon]       │                        │
│  │ {{CARD_TITLE}}│ │ {{CARD_TITLE}}│                        │
│  │ {{SUBTITLE}} │ │ {{SUBTITLE}} │                        │
│  │              │ │              │                        │
│  │ [{{TAG_4}}]  │ │ [{{TAG_5}}]  │                        │
│  └──────────────┘ └──────────────┘                        │
├── Footer ──────────────────────────────────────────────────┤
│  {{FILTERED}} / {{TOTAL}} mục                              │
└────────────────────────────────────────────────────────────┘

┌── Detail Dialog (modal) ──────────────────────────────────┐
│  {{ENTITY}} chi tiết                         [✕]          │
│  ┌────────────────────────────────────────────────────────┐│
│  │ [Icon]  {{NAME}}                                       ││
│  │ {{FIELD_1}}: {{VALUE_1}}                               ││
│  │ {{FIELD_2}}: {{VALUE_2}}                               ││
│  │ ...                                                    ││
│  └────────────────────────────────────────────────────────┘│
│                           (Đóng)                          │
└────────────────────────────────────────────────────────────┘
```

## Cây component

```
{{PageName}}Page
├── {{PageName}}Header
│   ├── Icon + Title + Stats
│   └── Button "Thêm mới"           ← variant default, size sm
├── {{PageName}}FilterBar
│   ├── Select (filter)             ← left side
│   └── Input (search)              ← right side
├── {{PageName}}CardsSection
│   └── Grid (responsive: 1-2-3 columns)
│       └── {{Entity}}Card
│           ├── Icon / Image
│           ├── Title
│           ├── Subtitle
│           ├── Badge(s)
│           └── Hover actions
├── {{PageName}}Footer
│   └── Count summary
└── Dialogs (conditional)
    ├── {{Entity}}DetailDialog      ← Xem chi tiết
    ├── Create{{Entity}}Dialog      ← Form tạo mới
    └── Edit{{Entity}}Dialog        ← Form chỉnh sửa
```

## State Flow

| State | Vị trí (hook / state) | Truyền đến component |
|---|---|---|
| `data` | `useGetXxx()` | `Page → CardsSection → Card` |
| `search` | `Page` (`useState`) | `Page → FilterBar` |
| `activeFilter` | `Page` (`useState`) | `Page → FilterBar` |
| `filteredData` | `Page` (`useMemo`) | `Page → CardsSection` |
| `selectedItem` | `Page` (`useState<T \| null>`) | `Page → DetailDialog` |
| `dialogOpen` | `Page` (`useState`) | `Page → CreateDialog` |

## Component Spec

| Component | File | Props |
|---|---|---|
| {{PageName}}Header | `header.tsx` | `totalItems: number` |
| {{PageName}}FilterBar | `filter-bar.tsx` | `activeFilter`, `onFilterChange`, `search`, `onSearchChange` |
| {{PageName}}CardsSection | `cards-section.tsx` | `items: T[]`, `onSelect`, `onEdit`, `onDelete` |
| {{Entity}}Card | `card.tsx` | `item: T`, `onSelect`, `onEdit`, `onDelete` |
| {{PageName}}Footer | `footer.tsx` | `totalItems: number` |
| {{Entity}}DetailDialog | `detail-dialog.tsx` | `open`, `onOpenChange`, `item: T` |
