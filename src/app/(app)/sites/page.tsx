"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { useGetUserProfile } from "@/features/auth";
import { type Site, useDeleteSite, useGetSites } from "@/features/site";
import {
  type ExportColumn,
  excelFileName,
  exportRowsToXlsx,
} from "@/utils/export";
import { createColumns } from "./columns";
import { CreateSiteDialog } from "./create-dialog";
import { SitesFooter } from "./footer";
import { SitesHeader } from "./header";
import { SitesTableSection } from "./table-section";
import { useSiteParams } from "./use-site-params";

const EXPORT_COLUMNS: ExportColumn<Site>[] = [
  { header: "Mã", accessor: (row) => row.code },
  { header: "Tên công trường", accessor: (row) => row.name },
  { header: "Phụ trách", accessor: (row) => row.manager || "" },
  { header: "SĐT", accessor: (row) => row.phone },
  { header: "Địa chỉ", accessor: (row) => row.address || "" },
  { header: "Trạng thái", accessor: (row) => row.statusLabel },
  { header: "Kho công trường", accessor: (row) => row.warehouse?.code ?? "" },
];

export default function SitesPage() {
  const { params, status, setSearch, setStatus } = useSiteParams();

  const { data } = useGetSites(params);

  const items = data ?? [];

  // Backend: create/update/destroy công trường = IsAdmin
  const { data: profile } = useGetUserProfile();
  const isAdmin = profile?.role === "admin";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);

  const { mutateAsync: deleteSite, isPending: isDeleting } = useDeleteSite();

  const columns = useMemo(
    () =>
      createColumns({
        onDelete: setDeleteTarget,
        canModify: isAdmin,
      }),
    [isAdmin],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <SitesHeader
        totalItems={items.length}
        onAdd={() => setDialogOpen(true)}
        canCreate={isAdmin}
        onExport={() =>
          exportRowsToXlsx({
            fileName: excelFileName("cong-truong"),
            sheetName: "Công trường",
            columns: EXPORT_COLUMNS,
            rows: items,
          })
        }
      />
      {/*<SitesFilterBar
        search={params.search ?? ""}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />*/}
      <SitesTableSection table={table} />
      <SitesFooter total={items.length} />

      <CreateSiteDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Vô hiệu hóa công trường"
        description={
          deleteTarget ? (
            <>
              Bạn có chắc muốn vô hiệu hóa công trường{" "}
              <strong>&quot;{deleteTarget.name}&quot;</strong>?
            </>
          ) : (
            ""
          )
        }
        onConfirm={async () => {
          if (deleteTarget) await deleteSite(deleteTarget.id);
        }}
        isPending={isDeleting}
      />
    </div>
  );
}
