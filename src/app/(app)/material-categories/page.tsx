"use client";

import {
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  type MaterialCategory,
  useGetCategories,
} from "@/features/material-category";
import { createColumns } from "./columns";
import { CreateCategoryDialog } from "./create-dialog";
import { EditCategoryDialog } from "./edit-dialog";
import { MaterialCategoriesFilterBar } from "./filter-bar";
import { MaterialCategoriesFooter } from "./footer";
import { MaterialCategoriesHeader } from "./header";
import { MaterialCategoriesTableSection } from "./table-section";

function filterTree(
  nodes: MaterialCategory[],
  search: string,
): MaterialCategory[] {
  const lower = search.toLowerCase();

  function filterNode(node: MaterialCategory): MaterialCategory | null {
    const nameMatch = node.name.toLowerCase().includes(lower);
    const codeMatch = node.code.toLowerCase().includes(lower);
    const selfMatch = nameMatch || codeMatch;

    const filteredChildren = node.children
      .map(filterNode)
      .filter((n): n is MaterialCategory => n !== null);

    if (selfMatch || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
    return null;
  }

  return nodes.map(filterNode).filter((n): n is MaterialCategory => n !== null);
}

function countAllNodes(nodes: MaterialCategory[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countAllNodes(node.children), 0);
}

export default function MaterialCategoryPage() {
  const { data: categories = [] } = useGetCategories();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<MaterialCategory | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    return filterTree(categories, search.trim());
  }, [categories, search]);

  const totalCount = useMemo(() => countAllNodes(categories), [categories]);

  const tableColumns = useMemo(
    () => createColumns({ onEdit: setEditingCategory }),
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns: tableColumns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.children,
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <MaterialCategoriesHeader
        totalCategories={totalCount}
        onAdd={() => setDialogOpen(true)}
      />
      <MaterialCategoriesFilterBar search={search} onSearchChange={setSearch} />
      <MaterialCategoriesTableSection table={table} />
      <MaterialCategoriesFooter table={table} totalCount={totalCount} />
      <CreateCategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <EditCategoryDialog
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />
    </div>
  );
}
