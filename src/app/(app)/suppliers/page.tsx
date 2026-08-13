"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {
  type Supplier,
  useDeleteSupplier,
  useGetSuppliers,
} from "@/features/supplier";
import { createColumns } from "./columns";
import { CreateSupplierDialog } from "./create-dialog";
import { EditSupplierDialog } from "./edit-dialog";
import { SuppliersFilterBar } from "./filter-bar";
import { SuppliersFooter } from "./footer";
import { SuppliersHeader } from "./header";
import { SuppliersTableSection } from "./table-section";
import { useSupplierParams } from "./use-supplier-params";

export default function SuppliersPage() {
  const { params, setSearch } = useSupplierParams();

  const { data } = useGetSuppliers(params);

  const items = data ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const { mutateAsync: deleteSupplier, isPending: isDeleting } =
    useDeleteSupplier();

  const tableColumns = useMemo(
    () =>
      createColumns({
        onEdit: setEditingSupplier,
        onDelete: setDeleteTarget,
      }),
    [],
  );

  const table = useReactTable({
    data: items,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <SuppliersHeader
        totalItems={items.length}
        onAdd={() => setDialogOpen(true)}
      />
      <SuppliersFilterBar
        search={params.search ?? ""}
        onSearchChange={setSearch}
      />
      <SuppliersTableSection table={table} />
      <SuppliersFooter total={items.length} />

      <CreateSupplierDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <EditSupplierDialog
        supplier={editingSupplier}
        onClose={() => setEditingSupplier(null)}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Vô hiệu hóa nhà cung cấp"
        description={
          deleteTarget ? (
            <>
              Bạn có chắc muốn vô hiệu hóa nhà cung cấp{" "}
              <strong>&quot;{deleteTarget.name}&quot;</strong>?
            </>
          ) : (
            ""
          )
        }
        onConfirm={async () => {
          if (deleteTarget) await deleteSupplier(deleteTarget.id);
        }}
        isPending={isDeleting}
      />
    </div>
  );
}
