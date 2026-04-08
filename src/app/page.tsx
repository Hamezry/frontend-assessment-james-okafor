import type { Metadata } from "next";
import { Suspense } from "react";
import { searchBooks } from "@/lib/api/openlibrary";
import type { SearchParams } from "@/types/book";
import BookGrid from "@/components/BookGrid/BookGrid";
import SearchBar from "@/components/SearchBar/SearchBar";
import FilterBar from "@/components/FilterBar/FilterBar";
import Pagination from "@/components/Pagination/Pagination";
import EmptyState from "@/components/EmptyState/EmptyState";
import BookGridSkeleton from "@/components/Skeleton/BookGridSkeleton";

export const metadata: Metadata = {
  title: "Book Explorer — Discover Your Next Read",
  description: "Search and browse millions of books from the Open Library.",
};

interface HomePageProps {
  searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { books, total, totalPages } = await searchBooks({
    query: params.q,
    subject: params.subject,
    sort: params.sort,
    page,
  });

  const hasResults = books.length > 0;
  const hasFilters = Boolean(params.q || params.subject);

  return (
    <div className="page-container py-8 sm:py-12">
      {/* Page hero */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          Discover Books
        </h1>
        <p className="text-slate-500 text-base">
          Explore{" "}
          <span className="font-medium text-slate-700">
            {total.toLocaleString()}
          </span>{" "}
          books from the Open Library catalogue.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar defaultValue={params.q ?? ""} />
        </Suspense>
        <Suspense fallback={<FilterBarFallback />}>
          <FilterBar
            currentSubject={params.subject ?? ""}
            currentSort={params.sort ?? ""}
          />
        </Suspense>
      </div>

      {/* Result count */}
      {hasResults && (
        <p
          className="text-sm text-slate-500 mb-4"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of{" "}
          {total.toLocaleString()} results
          {params.q ? ` for "${params.q}"` : ""}
        </p>
      )}

      {/* Content */}
      {hasResults ? (
        <>
          <BookGrid books={books} />
          <Pagination page={page} totalPages={totalPages} />
        </>
      ) : (
        <EmptyState query={params.q} hasFilters={hasFilters} />
      )}
    </div>
  );
}

function SearchBarFallback() {
  return <div className="skeleton h-11 flex-1 rounded-lg" aria-hidden="true" />;
}

function FilterBarFallback() {
  return (
    <div className="flex gap-2">
      <div className="skeleton h-11 w-36 rounded-lg" aria-hidden="true" />
      <div className="skeleton h-11 w-32 rounded-lg" aria-hidden="true" />
    </div>
  );
}

