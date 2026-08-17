"use client";

import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format, parseISO } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  /** Giá trị dạng "yyyy-MM-dd" (đúng format backend) hoặc null. */
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Date picker dùng Popover + Calendar (shadcn composition) thay cho
 * native `<Input type="date">`. Giá trị trao đổi với bên ngoài vẫn là
 * chuỗi "yyyy-MM-dd" để khớp query param của backend.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = value ? parseISO(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            variant="outline"
            data-empty={!value}
            className={cn(
              "justify-start text-left font-normal text-muted-foreground",
              className,
            )}
          />
        }
      >
        <HugeiconsIcon
          icon={Calendar02Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {placeholder}
        {value && (
          <>
            :{" "}
            <span className="text-foreground">
              {format(parseISO(value), "dd/MM/yyyy")}
            </span>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto gap-0 p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : null);
            setOpen(false);
          }}
        />
        {value && (
          <div className="flex justify-end border-t p-1.5">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              Xóa ngày
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
