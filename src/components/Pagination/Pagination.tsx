"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
}

const MAX_VISIBLE_PAGES = 5;

export default function Pagination({ page, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildPageUrl(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  // Compute visible page window
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {/* Previous */}
      <PaginationLink
        href={buildPageUrl(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </PaginationLink>

      {/* Start ellipsis */}
      {start > 1 && (
        <>
          <PaginationLink href={buildPageUrl(1)}>1</PaginationLink>
          {start > 2 && (
            <span className="px-1 text-slate-400 text-sm select-none">…</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map((p) => (
        <PaginationLink
          key={p}
          href={buildPageUrl(p)}
          active={p === page}
          aria-label={`Page ${p}`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </PaginationLink>
      ))}

      {/* End ellipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-slate-400 text-sm select-none">…</span>
          )}
          <PaginationLink href={buildPageUrl(totalPages)}>
            {totalPages}
          </PaginationLink>
        </>
      )}

      {/* Next */}
      <PaginationLink
        href={buildPageUrl(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </PaginationLink>
    </nav>
  );
}

interface PaginationLinkProps {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
}

function PaginationLink({
  href,
  active,
  disabled,
  children,
  ...props
}: PaginationLinkProps) {
  const base =
    "inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-medium transition-colors";

  if (disabled) {
    return (
      <span
        className={cn(base, "text-slate-300 cursor-not-allowed")}
        aria-disabled="true"
        role="button"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        base,
        active
          ? "bg-brand-600 text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100",
      )}
      scroll={true}
      {...props}
    >
      {children}
    </Link>
  );
}

