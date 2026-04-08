"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SUBJECT_OPTIONS, SORT_OPTIONS } from "@/types/book";

interface FilterBarProps {
  currentSubject: string;
  currentSort: string;
}

export default function FilterBar({
  currentSubject,
  currentSort,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      {/* Subject filter */}
      <div className="relative">
        <label htmlFor="subject-filter" className="sr-only">
          Filter by genre
        </label>
        <select
          id="subject-filter"
          value={currentSubject}
          onChange={(e) => updateParam("subject", e.target.value)}
          className="h-11 pl-3 pr-8 rounded-lg border border-slate-300 bg-white
                     text-sm text-slate-700 appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>

      {/* Sort filter */}
      <div className="relative">
        <label htmlFor="sort-filter" className="sr-only">
          Sort results
        </label>
        <select
          id="sort-filter"
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="h-11 pl-3 pr-8 rounded-lg border border-slate-300 bg-white
                     text-sm text-slate-700 appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

