"use client";

import { warehouses } from "@/lib/mock/data";
import WarehouseHeader from "./header";
import { WarehouseItem } from "./item";

export default function WarehousesPage() {
  return (
    <div className="flex h-full min-h-0 max-h-full flex-col overflow-auto">
      <WarehouseHeader warehouses={warehouses} />

      <div className="flex-1 flex flex-col gap-3 p-3">
        {warehouses.map((warehouse) => (
          <WarehouseItem key={warehouse.id} warehouse={warehouse} />
        ))}
      </div>
    </div>
  );
}
