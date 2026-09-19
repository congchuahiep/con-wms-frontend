"use client";
import { Form } from "@formisch/react";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddSite } from "@/features/site";
export function CreateSiteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { form, handleSubmit, isPending, resetForm } = useAddSite({ onSuccess: () => onOpenChange(false) });
  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={(o) => { if (!o) resetForm(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Thêm công trường</DialogTitle><DialogDescription>Tạo công trường mới</DialogDescription></DialogHeader>
        <Form of={form} onSubmit={handleSubmit} className="space-y-4">
          <InputField of={form} path={["code"]} label="Mã" placeholder="VD: CT_RG" required />
          <InputField of={form} path={["name"]} label="Tên công trường" placeholder="Công trường cầu Rạch Giá" required />
          <InputField of={form} path={["manager"]} label="Phụ trách" placeholder="Anh Bảy" />
          <InputField of={form} path={["phone"]} label="SĐT" placeholder="0901234567" />
          <TextareaField of={form} path={["address"]} label="Địa chỉ" placeholder="QL80, TP Rạch Giá" />
          <TextareaField of={form} path={["note"]} label="Ghi chú" placeholder="Khu vực chật, xe lớn khó vào" />
          <DialogFooter><Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Hủy</Button><Button type="submit" disabled={isPending}>{isPending ? "Đang tạo..." : "Thêm công trường"}</Button></DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
