"use client";

import { Building02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const markerContentVariants = cva("relative flex flex-col items-center", {
  variants: {
    variant: {
      default: "",
      muted: "opacity-70",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const markerPinVariants = cva(
  "flex items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg",
  {
    variants: {
      size: {
        sm: "size-6",
        md: "size-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const markerArrowVariants = cva(
  "-translate-y-1.5 rotate-45 border-b-2 border-r-2 border-background bg-primary",
  {
    variants: {
      size: {
        sm: "size-2.5",
        md: "size-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const markerIconVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-3",
      md: "size-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface WarehouseMarkerProps
  extends VariantProps<typeof markerContentVariants>,
    VariantProps<typeof markerPinVariants> {
  className?: string;
}

export function WarehouseMarker({
  className,
  size = "md",
  variant = "default",
}: WarehouseMarkerProps) {
  return (
    <div className={cn(markerContentVariants({ variant }), className)}>
      <div className={markerPinVariants({ size })}>
        <HugeiconsIcon
          icon={Building02Icon}
          strokeWidth={2}
          className={markerIconVariants({ size })}
        />
      </div>
      <div className={markerArrowVariants({ size })} />
    </div>
  );
}

type AdvancedMarkerProps = React.ComponentProps<typeof AdvancedMarker>;

interface WarehouseMapMarkerProps
  extends WarehouseMarkerProps,
    Omit<AdvancedMarkerProps, "children"> {
  children?: React.ReactNode;
}

export function WarehouseMapMarker({
  className,
  size = "md",
  variant = "default",
  children,
  ...advancedMarkerProps
}: WarehouseMapMarkerProps) {
  return (
    <AdvancedMarker {...advancedMarkerProps}>
      <WarehouseMarker size={size} variant={variant} className={className} />
      {children}
    </AdvancedMarker>
  );
}
