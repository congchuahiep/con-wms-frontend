import type React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number; // Giá trị từ 0 đến 100
  size?: number; // Kích thước pixel của vòng tròn
  strokeWidth?: number; // Độ dày của đường viền
  className?: string;
  children?: React.ReactNode; // Nội dung hiển thị ở giữa vòng tròn (ví dụ: phần trăm)
}

export function CircularProgress({
  value = 0,
  size = 64,
  strokeWidth = 3,
  className,
  children,
}: ProgressCircleProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <title>CircularProgress</title>
        {/* Vòng nền (Track) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Vòng tiến trình (Indicator) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-300 ease-in-out"
        />
      </svg>
      {/* Hiển thị chữ ở giữa vòng tròn */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
          {children}
        </div>
      )}
    </div>
  );
}
