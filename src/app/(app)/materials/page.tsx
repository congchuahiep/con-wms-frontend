"use client";

import { useMemo, useState } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { materialCategories, materials } from "@/lib/mock/data";
import { columns } from "./columns";
import { MaterialsFilterBar } from "./filter-bar";
import { MaterialsFooter } from "./footer";
import { MaterialsHeader } from "./header";
import { MaterialsTableSection } from "./table-section";

export default function MaterialsPage() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === null) return materials;

    const cat = materialCategories.find((c) => c.id === activeCategory);
    if (!cat) return materials;

    const childNames = new Set(cat.children.map((ch) => ch.name));
    return materials.filter((m) => childNames.has(m.category));
  }, [activeCategory]);

  const { table, globalFilter, setGlobalFilter } = useDataTable({
    data: filtered,
    columns,
    pageSize: 25,
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <MaterialsHeader
        totalItems={materials.length}
        totalCategories={materialCategories.length}
      />
      <MaterialsFilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={globalFilter}
        onSearchChange={setGlobalFilter}
      />
      <MaterialsTableSection table={table} />
      <MaterialsFooter table={table} />
    </div>
  );
}
