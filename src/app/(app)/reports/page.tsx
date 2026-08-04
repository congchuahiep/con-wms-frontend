import { Chart01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Báo cáo</h1>
        <p className="text-muted-foreground">Thống kê và báo cáo hệ thống</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
          <HugeiconsIcon
            icon={Chart01Icon}
            strokeWidth={2}
            className="size-10 text-muted-foreground/50"
          />
          <div className="text-center">
            <CardTitle className="text-base">Đang phát triển</CardTitle>
            <CardDescription>
              Tính năng báo cáo sẽ được bổ sung trong phiên bản tiếp theo
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
