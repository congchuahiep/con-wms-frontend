import {
  Archive01Icon,
  ArrowRight01Icon,
  Book01Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NOTE_TYPES = [
  {
    href: "/notes/inbound",
    title: "Nhập kho",
    description: "Phiếu nhập kho",
    icon: Invoice01Icon,
    enabled: true,
  },
  {
    href: "/notes/outbound",
    title: "Xuất kho",
    description: "Phiếu xuất kho",
    icon: Archive01Icon,
    enabled: false,
  },
  {
    href: "/notes/stocktake",
    title: "Kiểm kê",
    description: "Phiếu kiểm kê kho",
    icon: Book01Icon,
    enabled: false,
  },
] as const;

type NoteTypeItem = (typeof NOTE_TYPES)[number];

function NoteTypeCard({ item }: { item: NoteTypeItem }) {
  const card = (
    <Card
      className={
        item.enabled
          ? "h-full transition-colors hover:bg-accent/50"
          : "h-full opacity-60"
      }
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
          {item.title}
        </CardTitle>
        <CardDescription>
          {item.enabled ? item.description : "Sắp có"}
        </CardDescription>
      </CardHeader>
      {item.enabled && (
        <CardContent>
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            Xem danh sách
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
        </CardContent>
      )}
    </Card>
  );

  if (!item.enabled) {
    return (
      <div aria-disabled className="h-full">
        {card}
      </div>
    );
  }

  return (
    <Link href={item.href} className="block h-full">
      {card}
    </Link>
  );
}

export default function NotesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Chứng từ kho</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý phiếu nhập kho, xuất kho và kiểm kê.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NOTE_TYPES.map((item) => (
          <NoteTypeCard key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}
