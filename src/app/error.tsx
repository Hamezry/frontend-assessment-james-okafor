"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div className="page-container py-20 flex flex-col items-center text-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-8 h-8 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-500 max-w-md">
          We couldn&apos;t load the content you requested. This is usually a
          temporary issue with the Open Library API.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium
                     hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500
                     focus-visible:ring-offset-2 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm
                     font-medium hover:bg-slate-50 transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

