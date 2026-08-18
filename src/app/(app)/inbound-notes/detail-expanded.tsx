"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Alert } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { Spinner } from "@/components/ui/spinner";
import {
  type InboundNoteDetail,
  type InboundNoteLine,
  useGetInboundNote,
} from "@/features/inbound-note";
import { formatDateTime, formatDecimal } from "@/utils/format";

interface InboundNoteDetailExpandedProps {
  noteId: number;
}

/**
 * Chi tiết phiếu nhập hiển thị trong expanded row của bảng
 * (thay cho DetailDialog cũ). Fetch detail riêng vì list không kèm `lines`.
 */
export function InboundNoteDetailExpanded({
  noteId,
}: InboundNoteDetailExpandedProps) {
  const { data: note, isFetching } = useGetInboundNote(noteId);

  if (isFetching || !note) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        Đang tải chi tiết...
      </div>
    );
  }

  return <DetailContent note={note} />;
}

const LINE_COLUMNS: ColumnDef<InboundNoteLine>[] = [
  {
    id: "lineNo",
    accessorKey: "lineNo",
    header: "#",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<number>()}</span>
    ),
    size: 40,
    minSize: 40,
  },
  {
    id: "material",
    header: "Vật tư",
    cell: ({ row }) => (
      <span>
        <code>{row.original.material.code}</code>{" "}
        <span className="text-muted-foreground">
          {row.original.material.name}
        </span>
      </span>
    ),
    size: 400,
    minSize: 160,
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Số lượng",
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">
        {formatDecimal(getValue<string>())}
      </span>
    ),
    size: 100,
    minSize: 80,
  },
  {
    id: "unitPrice",
    accessorKey: "unitPrice",
    header: "Đơn giá",
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">
        {formatDecimal(getValue<string>(), 2)}
      </span>
    ),
    size: 120,
    minSize: 90,
  },
  {
    id: "lineTotal",
    header: "Thành tiền",
    cell: ({ row }) => (
      <span className="block text-right tabular-nums font-medium">
        {formatDecimal(
          Number(row.original.quantity) * Number(row.original.unitPrice),
          2,
        )}
      </span>
    ),
    size: 130,
    minSize: 100,
  },
  {
    id: "lineNote",
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<string>() || "-"}</span>
    ),
    size: 150,
    minSize: 100,
  },
];

function DetailContent({ note }: { note: InboundNoteDetail }) {
  const linesTable = useReactTable({
    data: note.lines,
    columns: LINE_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="ml-10 border-l bg-background">
      {note.status === "voided" && (
        <div className="p-2 pb-0">
          <Alert>
            <div className="text-sm">
              <p className="font-medium">Phiếu đã bị hủy</p>
              <p className="mt-1">
                Lý do: {note.voidReason || "-"}
                {note.voidedBy && <> · bởi {note.voidedBy.email}</>}
                {note.voidedAt && <> · {formatDateTime(note.voidedAt)}</>}
              </p>
            </div>
          </Alert>
        </div>
      )}

      <div className="border-b p-2">
        <InfoItem label="Ghi chú:" value={note.note || "-"} />
      </div>

      <DataTable
        table={linesTable}
        stickyHeader={false}
        emptyPlaceholder="Không có dòng vật tư"
      />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex w-xs items-baseline gap-1.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="whitespace-normal">{value}</p>
    </div>
  );
}
