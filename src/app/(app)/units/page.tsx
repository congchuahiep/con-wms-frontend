"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {
  type Unit,
  useDeleteUnit,
  useGetUnits,
} from "@/features/unit";
import { createColumns } from "./columns";
import { CreateUnitDialog } from "./create-dialog";
import { EditUnitDialog } from "./edit-dialog";
import { UnitsFilterBar } from "./filter-bar";
import { UnitsFooter } from "./footer";
import { UnitsHeader } from "./header";
import { UnitsTableSection } from "./table-section";

function filterUnits(units: Unit[], search: string): Unit[] {
  const lower = search.toLowerCase();
  return units.filter(
    (u) =>
      u.code.toLowerCase().includes(lower) ||
      u.name.toLowerCase().includes(lower),
  );
}

export default function UnitsPage() {
  const { data: units = [] } = useGetUnits();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Unit | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return units;
    return filterUnits(units, search.trim());
  }, [units, search]);

  const totalCount = units.length;

  const { mutate: deleteUnit, isPending: isDeleting } = useDeleteUnit();

  const tableColumns = useMemo(
    () =>
      createColumns({
        onEdit: setEditingUnit,
        onDelete: setDeleteTarget,
      }),
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <UnitsHeader totalUnits={totalCount} onAdd={() => setDialogOpen(true)} />
      <UnitsFilterBar search={search} onSearchChange={setSearch} />
      <UnitsTableSection table={table} />
      <UnitsFooter table={table} totalCount={totalCount} />

      <CreateUnitDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <EditUnitDialog
        unit={editingUnit}
        onClose={() => setEditingUnit(null)}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Xoá đơn vị"
        description={
          deleteTarget ? (
            <>
              Bạn có chắc muốn xoá đơn vị{" "}
              <strong>"{deleteTarget.name}"</strong>? Hành động này không thể
              hoàn tác.
            </>
          ) : (
            ""
          )
        }
        onConfirm={() => {
          if (deleteTarget) deleteUnit(deleteTarget.id);
        }}
        isPending={isDeleting}
      />
    </div>
  );
}
