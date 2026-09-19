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
  type StocktakeNoteDetail,
  type StocktakeLine,
  useGetStocktakeNote,
} from "@/features/stocktake";
import { cn } from "@/lib/utils";
import { formatDateTime, formatDecimal } from "@/utils/format";

interface StocktakeNoteDetailExpandedProps {
  noteId: number;
}

export function StocktakeNoteDetailExpanded({
  noteId,
}: StocktakeNoteDetailExpandedProps) {
  const { data: note, isFetching } = useGetStocktakeNote(noteId);

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

const LINE_COLUMNS: ColumnDef<StocktakeLine>[] = [
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
    size: 300,
    minSize: 160,
  },
  {
    id: "difference",
    accessorKey: "difference",
    header: "Chênh lệch",
    cell: ({ getValue }) => {
      const raw = getValue<string>();
      const num = Number(raw);
      return (
        <span
          className={cn(
            "block text-right tabular-nums font-medium",
            num > 0 && "text-blue-600",
            num < 0 && "text-red-600",
          )}
        >
          {num > 0 ? "+" : ""}
          {formatDecimal(raw)}
        </span>
      );
    },
    size: 110,
    minSize: 90,
  },
  {
    id: "reason",
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ getValue }) => (
      <span className="whitespace-normal">{getValue<string>() || "-"}</span>
    ),
    size: 200,
    minSize: 120,
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

function DetailContent({ note }: { note: StocktakeNoteDetail }) {
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
