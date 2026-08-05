"use client";

import {
  Form,
  Field as FormField,
  getErrors,
  getInput,
  setInput,
} from "@formisch/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { WarehouseMapMarker } from "@/components/warehouse-marker";
import { ValidationError } from "@/errors";
import { useAddWarehouse } from "@/features/warehouse";

const DEFAULT_CENTER = { lat: 10.762622, lng: 106.660172 };

export function WarehouseCreateDialog() {
  const [open, setOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const {
    form,
    handleSubmit,
    isPending,
    error,
    reset: resetForm,
  } = useAddWarehouse({
    onSuccess: () => {
      setOpen(false);
      toast.add({
        title: (
          <>
            Đã tạo nhà kho &quot;
            <span className="font-semibold">{formInput.name}</span>&quot; thành
            công.
          </>
        ),
      });
    },
  });

  const formInput = getInput(form);
  const latitude = formInput.latitude;
  const longitude = formInput.longitude;

  const setCoordinates = (lat: number, lng: number) => {
    setInput(form, { path: ["latitude"], input: lat });
    setInput(form, { path: ["longitude"], input: lng });
    setMapCenter({ lat, lng });
  };

  const handleMapClick = (ev: {
    detail?: { latLng?: { lat: number; lng: number } | null };
  }) => {
    const latLng = ev.detail?.latLng;
    if (!latLng) return;
    setCoordinates(latLng.lat, latLng.lng);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          resetForm();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Thêm một nhà kho mới
          </Button>
        }
      />

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm kho mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin kho và chọn vị trí trên bản đồ.
          </DialogDescription>
        </DialogHeader>

        <Form of={form} onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            {error && !(error instanceof ValidationError) && (
              <Alert>Lỗi: {error.message}</Alert>
            )}

            <InputField
              of={form}
              path={["code"]}
              label="Mã kho"
              placeholder="VD: KHO_CHINH"
              required
              disabled={isPending}
            />

            <InputField
              of={form}
              path={["name"]}
              label="Tên kho"
              placeholder="VD: Kho chính — Bãi sau"
              required
              disabled={isPending}
            />

            <FormField of={form} path={["address"]}>
              {(field) => (
                <Field data-invalid={field.errors ? true : undefined}>
                  <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
                  <AddressAutocomplete
                    id="address"
                    placeholder="VD: Tầng 1, Tòa nhà VP"
                    value={field.input ?? ""}
                    onChange={(value) => field.onChange(value)}
                    onPlaceSelect={(place) => {
                      field.onChange(place.address);
                      setCoordinates(place.latitude, place.longitude);
                    }}
                    disabled={isPending}
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormField>

            <TextareaField
              of={form}
              path={["note"]}
              label="Ghi chú"
              placeholder="VD: Kho thuế của ông Ba, hết hạn 12/2026"
              disabled={isPending}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vị trí trên bản đồ</span>
                <span className="text-xs text-muted-foreground">
                  Click lên bản đồ để chọn vị trí
                </span>
              </div>

              <div className="relative h-64 w-full overflow-hidden rounded-lg border">
                <GoogleMap
                  mapId="warehouse-location"
                  className="size-full"
                  defaultCenter={DEFAULT_CENTER}
                  defaultZoom={15}
                  gestureHandling="greedy"
                  disableDefaultUI
                  clickableIcons={false}
                  draggableCursor="default"
                  draggingCursor="move"
                  onClick={handleMapClick}
                >
                  <MapCameraController target={mapCenter} />
                  {latitude !== null && longitude !== null && (
                    <WarehouseMapMarker
                      position={{
                        lat: latitude as number,
                        lng: longitude as number,
                      }}
                    />
                  )}
                </GoogleMap>
              </div>

              {[
                ...(getErrors(form as never, { path: ["latitude"] } as never) ??
                  []),
                ...(getErrors(
                  form as never,
                  { path: ["longitude"] } as never,
                ) ?? []),
              ].length > 0 && (
                <FieldError
                  errors={[
                    ...(getErrors(
                      form as never,
                      {
                        path: ["latitude"],
                      } as never,
                    ) ?? []),
                    ...(getErrors(
                      form as never,
                      {
                        path: ["longitude"],
                      } as never,
                    ) ?? []),
                  ].map((message) => ({ message }))}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu kho"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function MapCameraController({
  target,
}: {
  target: { lat: number; lng: number };
}) {
  const map = useMap();
  const lastTarget = useRef(target);

  useEffect(() => {
    if (!map) return;

    if (
      lastTarget.current.lat !== target.lat ||
      lastTarget.current.lng !== target.lng
    ) {
      map.panTo(target);
      lastTarget.current = target;
    }
  }, [map, target]);

  return null;
}
