'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BookDetailError({ error, reset }: ErrorProps) {
  return (
    <div className="page-container py-20 flex flex-col items-center text-center gap-6">
      <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-7 h-7 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
          Couldn&apos;t load this book
        </h2>
        <p className="text-slate-500 max-w-sm">
          Open Library may be temporarily unavailable. Please try again in a moment.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium
                     hover:bg-brand-700 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm
                     font-medium hover:bg-slate-50 transition-colors"
        >
          Back to search
        </a>
      </div>
    </div>
  );
}
