import { EllipsisIcon, Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Map as GoogleMap } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WarehouseMapMarker } from "@/components/warehouse-marker";
import type { Warehouse } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export function WarehouseItem({ warehouse }: { warehouse: Warehouse }) {
  return (
    <div
      key={warehouse.id}
      className={cn(
        "h-56 w-full border rounded-xl p-1",
        "grid grid-cols-7",
        "shadow bg-background",
      )}
    >
      <div className="p-2 pr-3 col-span-2 flex flex-col">
        <div className="flex-1">
          <h3 className="font-semibold">{warehouse.name}</h3>

          <p className="mb-2 font-mono text-xs text-muted-foreground">
            {warehouse.code}
          </p>

          <div className="flex items-start text-muted-foreground text-sm">
            <HugeiconsIcon
              icon={Location01Icon}
              strokeWidth={2}
              className="mt-0.5 size-4 shrink-0 mr-1"
            />
            <span>{warehouse.address}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <WarehouseStats warehouse={warehouse} />

          <div className="flex gap-1">
            <Button
              size="sm"
              className="flex-1"
              render={<Link href={`/warehouses/${warehouse.id}`} />}
              nativeButton={false}
            >
              Xem chi tiết
            </Button>

            <Button variant="outline" size="icon-sm">
              <HugeiconsIcon
                icon={EllipsisIcon}
                strokeWidth={2}
                className="size-4"
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden col-span-5">
        <GoogleMap
          mapId={`warehouse-map-${warehouse.id}`}
          className="size-full"
          defaultCenter={{
            lat: warehouse.latitude ?? 10.762622,
            lng: warehouse.longitude ?? 106.660172,
          }}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI
          clickableIcons={false}
          draggableCursor="default"
          draggingCursor="move"
        >
          {warehouse.latitude && warehouse.longitude && (
            <WarehouseMapMarker
              position={{
                lat: warehouse.latitude,
                lng: warehouse.longitude,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

function WarehouseStats({ warehouse }: { warehouse: Warehouse }) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 place-items-center gap-1 p-1.5",
        "bg-secondary h-16 w-full self-center rounded border",
      )}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-base font-semibold leading-none">
          {warehouse.itemCount}
        </span>
        <span className="text-xs text-muted-foreground">Vật tư</span>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-base font-semibold leading-none">
          {warehouse.totalQuantity.toLocaleString("vi-VN")}
        </span>
        <span className="text-xs text-muted-foreground">Tổng tồn</span>
      </div>

      <div
        className={cn(
          "flex flex-col items-center gap-0.5 justify-center",
          "rounded size-full",
          warehouse.lowStock > 0 && "text-destructive bg-red-100",
        )}
      >
        <span
          className={cn(
            "text-base font-semibold leading-none",
            warehouse.lowStock > 0 && "text-destructive",
          )}
        >
          {warehouse.lowStock}
        </span>

        <span
          className={cn(
            "text-xs text-muted-foreground",
            warehouse.lowStock > 0 && "text-destructive",
          )}
        >
          Mặt hàng sắp hết
        </span>
      </div>
    </div>
  );
}
