"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

export type UseUrlSearchParamResult = {
  /** Giá trị đã commit lên URL (`?search=...`; `""` nếu chưa có) — dùng làm param API. */
  value: string;
  /** Giá trị tức thời trong ô nhập (gõ nhanh không chờ debounce) — dùng làm value cho input. */
  inputValue: string;
  setInputValue: (next: string) => void;
};

/**
 * Đồng bộ một giá trị search với query param trên URL — URL là nguồn sự thật.
 *
 * - **Đọc:** `value` phái sinh từ `useSearchParams`. URL đổi từ ngoài (link từ
 *   sổ kho, back/forward, status tab giữ nguyên param) tự đồng bộ vào ô nhập.
 * - **Ghi:** `setInputValue` cập nhật ô nhập ngay; sau `SEARCH_DEBOUNCE_MS`
 *   commit lên URL bằng `router.replace` (giữ các param khác, bỏ `page`) —
 *   không tạo entry lịch sử cho từng phím gõ.
 * - Chỉ có **một** debounce: page hook dùng `value` cho param API nên refetch
 *   xảy ra đúng khi URL commit, không cần debounce thứ hai.
 */
export function useUrlSearchParam(param = "search"): UseUrlSearchParamResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get(param) ?? "";
  const [inputValue, setInputValueState] = useState(value);

  // URL đổi từ ngoài → đổ vào ô nhập (không ghi đè URL).
  useEffect(() => {
    setInputValueState(value);
  }, [value]);

  // Gõ xong (debounce) → commit lên URL bằng replace.
  useEffect(() => {
    if (inputValue === value) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (inputValue) params.set(param, inputValue);
      else params.delete(param);
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue, value, param, searchParams, pathname, router]);

  const setInputValue = useCallback((next: string) => {
    setInputValueState(next);
  }, []);

  return { value, inputValue, setInputValue };
}
