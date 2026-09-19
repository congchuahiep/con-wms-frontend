"use client";
import { Form } from "@formisch/react";
import { useEffect, useState } from "react";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { ValidationError } from "@/errors";
import { type Site, useUpdateSite } from "@/features/site";
export function EditSiteDialog({ site, onClose }: { site: Site | null; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (site) setOpen(true); }, [site]);
  return (
    <Dialog open={open} onOpenChange={setOpen} onOpenChangeComplete={(o) => { if (!o) onClose(); }}>
      <DialogContent>{site && <EditSiteForm site={site} onClose={() => setOpen(false)} />}</DialogContent>
    </Dialog>
  );
}
function EditSiteForm({ site, onClose }: { site: Site; onClose: () => void }) {
  const { form, handleSubmit, isPending, isDirty, error } = useUpdateSite(site.id, { code: site.code, name: site.name, manager: site.manager, phone: site.phone, address: site.address, note: site.note }, { onSuccess: () => { toast.add({ title: "Thành công", description: "Đã cập nhật công trường" }); onClose(); } });
  return (
    <>
      <DialogHeader><DialogTitle>Sửa công trường</DialogTitle><DialogDescription>Chỉnh sửa &quot;{site.name}&quot;</DialogDescription></DialogHeader>
      <Form of={form} onSubmit={handleSubmit} className="space-y-4">
        {error && !(error instanceof ValidationError) && <Alert>Lỗi: {error.message}</Alert>}
        <InputField of={form} path={["code"]} label="Mã" required />
        <InputField of={form} path={["name"]} label="Tên" required />
        <InputField of={form} path={["manager"]} label="Phụ trách" />
        <InputField of={form} path={["phone"]} label="SĐT" />
        <TextareaField of={form} path={["address"]} label="Địa chỉ" />
        <TextareaField of={form} path={["note"]} label="Ghi chú" />
        <DialogFooter><Button variant="outline" type="button" onClick={onClose}>Hủy</Button><Button type="submit" disabled={!isDirty || isPending}>{isPending ? "Đang lưu..." : "Lưu thay đổi"}</Button></DialogFooter>
      </Form>
    </>
  );
}
