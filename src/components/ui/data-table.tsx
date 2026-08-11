"use client";

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table as TableRoot,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  table: Table<TData>;
  className?: string;
  emptyPlaceholder?: React.ReactNode;
  showHeader?: boolean;
}

export function DataTable<TData>({
  table,
  className,
  emptyPlaceholder,
  showHeader = true,
}: DataTableProps<TData>) {
  // Tính tổng minSize của tất cả columns để table có thể scroll ngang
  // khi container quá hẹp (theo page-design skill convention)
  const minTableWidth = table
    .getAllLeafColumns()
    .reduce((sum, column) => sum + (column.columnDef.minSize ?? 0), 0);

  return (
    <div
      className={cn("w-full overflow-x-auto", className)}
      style={minTableWidth > 0 ? { minWidth: minTableWidth } : undefined}
    >
      <TableRoot className="w-full table-fixed">
        {showHeader && (
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.column.columnDef.size !== undefined
                          ? header.column.columnDef.size
                          : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <HugeiconsIcon
                              icon={ArrowUp01Icon}
                              strokeWidth={2}
                              className="size-3.5"
                            />
                          ),
                          desc: (
                            <HugeiconsIcon
                              icon={ArrowDown01Icon}
                              strokeWidth={2}
                              className="size-3.5"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        )}
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyPlaceholder ?? "Không tìm thấy dữ liệu"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>
    </div>
  );
}
