"use client";

import { useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export function useAutocompleteSuggestions(inputValue: string) {
  const places = useMapsLibrary("places");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [sessionToken, setSessionToken] = useState<
    google.maps.places.AutocompleteSessionToken | null
  >(null);

  useEffect(() => {
    if (!places) return;
    setSessionToken(new places.AutocompleteSessionToken());
  }, [places]);

  useEffect(() => {
    if (!places || !sessionToken || !inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: inputValue,
      sessionToken,
      region: "vn",
    })
      .then((response) => {
        if (cancelled) return;
        setSuggestions(response.suggestions);
      })
      .catch(() => {
        if (cancelled) return;
        setSuggestions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [inputValue, places, sessionToken]);

  const resetSession = () => {
    setSessionToken(places ? new places.AutocompleteSessionToken() : null);
  };

  return { suggestions, sessionToken, resetSession };
}
