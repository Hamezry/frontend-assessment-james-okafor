import Link from "next/link";

interface EmptyStateProps {
  query?: string;
  hasFilters: boolean;
}

export default function EmptyState({ query, hasFilters }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center text-center py-20 gap-6"
    >
      {/* Illustration */}
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          className="w-10 h-10 text-slate-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
          />
        </svg>
      </div>

      <div className="max-w-sm">
        <h2 className="font-serif text-xl font-bold text-slate-900 mb-2">
          {query ? `No results for "${query}"` : "No books found"}
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          {hasFilters
            ? "Try adjusting your search terms or removing genre and sort filters."
            : "Start by searching for a title, author, or topic."}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        {hasFilters && (
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium
                       hover:bg-brand-700 transition-colors"
          >
            Clear all filters
          </Link>
        )}
        <a
          href="https://openlibrary.org"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm
                     font-medium hover:bg-slate-50 transition-colors"
        >
          Try Open Library directly
        </a>
      </div>
    </div>
  );
}

