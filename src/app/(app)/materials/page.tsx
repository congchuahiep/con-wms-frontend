"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {
  type Material,
  useDeleteMaterial,
  useGetMaterials,
} from "@/features/material";
import { createColumns } from "./columns";
import { CreateMaterialDialog } from "./create-dialog";
import { EditMaterialDialog } from "./edit-dialog";
import { MaterialsFilterBar } from "./filter-bar";
import { MaterialsFooter } from "./footer";
import { MaterialsHeader } from "./header";
import { MaterialsTableSection } from "./table-section";
import { useMaterialParams } from "./use-material-params";

export default function MaterialsPage() {
  const { params, setSearch, setCategory, setPage } = useMaterialParams();

  const { data } = useGetMaterials(params);

  const items = data?.items ?? [];
  const meta = data?.meta;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);

  const { mutateAsync: deleteMaterial, isPending: isDeleting } =
    useDeleteMaterial();

  const tableColumns = useMemo(
    () => createColumns({ onEdit: setEditingMaterial, onDelete: setDeleteTarget }),
    [],
  );

  const table = useReactTable({
    data: items,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <MaterialsHeader
        totalItems={meta?.total ?? 0}
        onAdd={() => setDialogOpen(true)}
      />
      <MaterialsFilterBar
        categoryFilter={params.category ?? null}
        onCategoryChange={setCategory}
        search={params.search ?? ""}
        onSearchChange={setSearch}
      />
      <MaterialsTableSection table={table} />
      <MaterialsFooter
        page={meta?.page ?? 1}
        pageSize={meta?.pageSize ?? 20}
        total={meta?.total ?? 0}
        hasNextPage={meta?.hasNextPage ?? false}
        hasPreviousPage={meta?.hasPreviousPage ?? false}
        onPageChange={setPage}
      />

      <CreateMaterialDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <EditMaterialDialog
        material={editingMaterial}
        onClose={() => setEditingMaterial(null)}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Xoá vật tư"
        description={
          deleteTarget ? (
            <>
              Bạn có chắc muốn xoá vật tư{" "}
              <strong>&quot;{deleteTarget.name}&quot;</strong>? Hành động này
              không thể hoàn tác.
            </>
          ) : (
            ""
          )
        }
        onConfirm={async () => {
          if (deleteTarget) await deleteMaterial(deleteTarget.id);
        }}
        isPending={isDeleting}
      />
    </div>
  );
}
