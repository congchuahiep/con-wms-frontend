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
    <Tabs value={value} onValueChange={onChange} className="border-b">
      <TabsList variant="line" className="h-10!">
        {stockTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="h-full">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
