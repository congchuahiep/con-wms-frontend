"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAutocompleteSuggestions } from "@/hooks/use-autocomplete-suggestions";
import { cn } from "@/lib/utils";

export interface AddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AddressAutocomplete({
  id,
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  disabled,
}: AddressAutocompleteProps) {
  const places = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const { suggestions, resetSession } = useAutocompleteSuggestions(
    open ? inputValue : "",
  );

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = async (
    suggestion: google.maps.places.AutocompleteSuggestion,
  ) => {
    if (!places || !suggestion.placePrediction) return;

    const place = suggestion.placePrediction.toPlace();
    await place.fetchFields({
      fields: ["location", "formattedAddress"],
    });

    const location = place.location;
    if (!location) return;

    const address =
      place.formattedAddress ?? suggestion.placePrediction.text.text;
    setInputValue(address);
    onChange(address);
    onPlaceSelect?.({
      address,
      latitude: location.lat(),
      longitude: location.lng(),
    });
    setOpen(false);
    resetSession();
  };

  const handleValueChange = (
    nextValue: string,
    details: Autocomplete.Root.ChangeEventDetails,
  ) => {
    setInputValue(nextValue);
    onChange(nextValue);

    if (details.reason === "item-press") {
      const selected = suggestions.find(
        (s) => s.placePrediction?.text.text === nextValue,
      );
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  return (
    <Autocomplete.Root
      items={suggestions}
      value={inputValue}
      onValueChange={handleValueChange}
      onOpenChange={setOpen}
      open={open}
      itemToStringValue={(item) => item.placePrediction?.text.text ?? ""}
      filter={null}
    >
      <Autocomplete.Input
        id={id}
        render={<Input />}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />

      <Autocomplete.Portal>
        <Autocomplete.Positioner
          className="z-50"
          sideOffset={4}
          align="start"
        >
          <Autocomplete.Popup className="rounded-lg border bg-popover text-popover-foreground shadow-lg">
            <Autocomplete.List
              className={cn(
                "max-h-72 overflow-y-auto py-1",
                suggestions.length === 0 && "hidden",
              )}
            >
              {(suggestion: google.maps.places.AutocompleteSuggestion) => (
                <Autocomplete.Item
                  key={suggestion.placePrediction?.placeId ?? suggestion.placePrediction?.text.text}
                  value={suggestion}
                  className={cn(
                    "cursor-default px-3 py-2 text-sm outline-none",
                    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {suggestion.placePrediction?.text.text}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
