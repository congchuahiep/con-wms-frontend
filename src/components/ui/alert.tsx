import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export function Alert({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-3 text-sm",
        "grid grid-cols-[20px_1fr] items-start gap-2",
        "border-destructive text-destructive bg-red-50 border-dashed",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon icon={Alert02Icon} size={20} />
      {children}
    </div>
  );
}
