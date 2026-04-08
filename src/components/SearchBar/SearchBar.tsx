"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  defaultValue?: string;
}

export default function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 350);

  // Navigate whenever the debounced value changes
  const buildUrl = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      // Reset to page 1 on any new search
      params.delete("page");
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  useEffect(() => {
    if (debouncedValue !== (searchParams.get("q") ?? "")) {
      router.push(buildUrl(debouncedValue), { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  function handleClear() {
    setValue("");
  }

  return (
    <div className="relative flex-1">
      <label htmlFor="book-search" className="sr-only">
        Search books by title or author
      </label>
      {/* Search icon */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
      <input
        id="book-search"
        type="search"
        role="searchbox"
        aria-label="Search books"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search books or authors…"
        className="w-full h-11 pl-10 pr-9 rounded-lg border border-slate-300 bg-white
                   text-sm text-slate-900 placeholder:text-slate-400
                   focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                   transition-shadow"
        autoComplete="off"
        spellCheck="false"
      />
      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                     hover:text-slate-600 transition-colors"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
}

