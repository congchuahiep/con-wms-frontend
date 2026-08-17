"use client";

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Row, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  table: Table<TData>;
  className?: string;
  emptyPlaceholder?: React.ReactNode;
  showHeader?: boolean;
  /**
   * Header dính khi scroll container (mặc định true).
   * Tắt khi bảng nằm trong expanded row / bảng con — tránh
   * đè lên header sticky của bảng chính.
   */
  stickyHeader?: boolean;
  /**
   * Render nội dung mở rộng dưới mỗi row (TanStack row expansion).
   * Khi có prop này, row đang expand (`row.getIsExpanded()`) sẽ kèm thêm
   * 1 hàng full-width bên dưới chứa nội dung trả về.
   */
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
}

export function DataTable<TData>({
  table,
  className,
  emptyPlaceholder,
  showHeader = true,
  stickyHeader = true,
  renderExpandedRow,
}: DataTableProps<TData>) {
  const columns = table.getAllLeafColumns();
  // Với `table-layout: fixed`, cột có `size` luôn render đúng `size`, còn cột
  // cuối (`width: auto`) chỉ nhận được phần KHÔNG GIAN CÒN LẠI của table. Nếu
  // table hẹp hơn tổng các cột cố định, phần còn lại âm => cột cuối bị ép về 0
  // (`min-width` trên cell bị bỏ qua trong fixed layout). Do đó wrapper phải có
  // min-width đủ lớn để khi viewport co lại, table tràn sang `overflow-x-auto`
  // thay vì co cột về 0.
  const minTableWidth = columns.reduce((sum, column, index) => {
    if (index === columns.length - 1) {
      // Cột cuối (auto) chỉ cần một "sàn" tối thiểu.
      return sum + (column.columnDef.minSize ?? column.columnDef.size ?? 0);
    }
    return sum + (column.columnDef.size ?? column.columnDef.minSize ?? 0);
  }, 0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const fillerRowRef = useRef<HTMLTableRowElement>(null);
  const [fillerHeight, setFillerHeight] = useState(0);

  // Row placeholder là <tr> thật ở cuối bảng. Table layout không có cơ chế CSS
  // thuần để một hàng "hút" hết chiều cao còn lại, nên đo bằng JS:
  // filler = chiều cao wrapper − chiều cao nội dung (không tính chính filler).
  // Khi nội dung tràn container, filler tự co về 0 và wrapper scroll.
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const fillerRow = fillerRowRef.current;
    const table = wrapper?.querySelector("table");
    if (!wrapper || !fillerRow || !table) return;

    const measure = () => {
      const contentHeight =
        table.getBoundingClientRect().height -
        fillerRow.getBoundingClientRect().height;
      setFillerHeight(
        Math.max(0, Math.round(wrapper.clientHeight - contentHeight)),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper, { box: "content-box" });
    observer.observe(table);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn("h-full w-full overflow-auto", className)}
    >
      <table
        data-slot="table"
        className="w-full caption-bottom text-sm table-fixed"
        style={minTableWidth > 0 ? { minWidth: minTableWidth } : undefined}
      >
        {showHeader && (
          <TableHeader
            className={cn(
              stickyHeader && "sticky top-0 z-10 bg-background",
              "border-b",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        index === headerGroup.headers.length - 1
                          ? "auto"
                          : header.column.columnDef.size,
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                    className="border-r"
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
              <Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-r">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {renderExpandedRow && row.getIsExpanded() && (
                  <TableRow>
                    <TableCell
                      colSpan={row.getVisibleCells().length}
                      className="p-0 border-b bg-muted/50"
                    >
                      {renderExpandedRow(row)}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
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

          <TableRow
            ref={fillerRowRef}
            aria-hidden
            className="hover:bg-transparent"
            style={{ height: fillerHeight }}
          >
            {table.getAllColumns().map((column) => (
              <TableCell key={column.id} className="border-r" />
            ))}
          </TableRow>
        </TableBody>
      </table>
    </div>
  );
}
