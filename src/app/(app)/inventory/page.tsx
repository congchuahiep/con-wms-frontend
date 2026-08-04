"use client";

import { useMemo, useState } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import {
  inventory,
  materialCategories,
  warehouses,
} from "@/lib/mock/data";
import { columns } from "./columns";
import { InventoryFilterBar } from "./filter-bar";
import { InventoryFooter } from "./footer";
import { InventoryHeader } from "./header";
import { InventoryTableSection } from "./table-section";
import { InventoryTabs } from "./tabs";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeWarehouse, setActiveWarehouse] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let data = inventory;

    if (activeTab === "low") {
      data = data.filter((m) => m.quantity < 50);
    } else if (activeTab === "inStock") {
      data = data.filter((m) => m.quantity >= 50);
    }

    if (activeCategory !== null) {
      const cat = materialCategories.find((c) => c.id === activeCategory);
      if (cat) {
        const childNames = new Set(cat.children.map((ch) => ch.name));
        data = data.filter((m) => childNames.has(m.category));
      }
    }

    if (activeWarehouse !== null) {
      data = data.filter((m) => m.warehouseId === activeWarehouse);
    }

    return data;
  }, [activeTab, activeCategory, activeWarehouse]);

  const { table, globalFilter, setGlobalFilter } = useDataTable({
    data: filtered,
    columns,
    pageSize: 25,
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <InventoryHeader
        totalItems={inventory.length}
        totalWarehouses={warehouses.length}
      />
      <InventoryTabs value={activeTab} onChange={setActiveTab} />
      <InventoryFilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeWarehouse={activeWarehouse}
        onWarehouseChange={setActiveWarehouse}
        search={globalFilter}
        onSearchChange={setGlobalFilter}
      />
      <InventoryTableSection table={table} />
      <InventoryFooter table={table} />
    </div>
  );
}
