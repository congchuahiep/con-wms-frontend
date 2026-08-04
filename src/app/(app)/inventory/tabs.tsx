"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stockTabs = [
  { value: "all", label: "Tất cả" },
  { value: "low", label: "Sắp hết" },
  { value: "inStock", label: "Còn hàng" },
];

interface InventoryTabsProps {
  value: string;
  onChange: (value: string) => void;
}

export function InventoryTabs({ value, onChange }: InventoryTabsProps) {
  return (
    <div className="shrink-0 border-b px-2 py-1">
      <Tabs value={value} onValueChange={onChange}>
        <TabsList variant="line">
          {stockTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
