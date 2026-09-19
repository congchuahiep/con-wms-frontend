"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { type Site, useDeleteSite, useGetSites } from "@/features/site";
import { createColumns } from "./columns";
import { CreateSiteDialog } from "./create-dialog";
import { EditSiteDialog } from "./edit-dialog";
import { SitesFilterBar } from "./filter-bar";
import { SitesFooter } from "./footer";
import { SitesHeader } from "./header";
import { SitesTableSection } from "./table-section";
import { useSiteParams } from "./use-site-params";
export default function SitesPage() {
  const { params, setSearch } = useSiteParams();
  const { data } = useGetSites(params);
  const items = data ?? [];
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const { mutateAsync: del, isPending } = useDeleteSite();
  const cols = useMemo(() => createColumns({ onEdit: setEditing, onDelete: setDeleteTarget }), []);
  const table = useReactTable({ data: items, columns: cols, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <SitesHeader totalItems={items.length} onAdd={() => setOpen(true)} />
      <SitesFilterBar search={params.search ?? ""} onSearchChange={setSearch} />
      <SitesTableSection table={table} />
      <SitesFooter total={items.length} />
      <CreateSiteDialog open={open} onOpenChange={setOpen} />
      <EditSiteDialog site={editing} onClose={() => setEditing(null)} />
      <DeleteConfirmDialog open={deleteTarget !== null} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }} title="Vô hiệu hóa công trường" description={deleteTarget ? <>Bạn có chắc vô hiệu hóa &quot;{deleteTarget.name}&quot;?</> : ""} onConfirm={async () => { if (deleteTarget) await del(deleteTarget.id); }} isPending={isPending} />
    </div>
  );
}
