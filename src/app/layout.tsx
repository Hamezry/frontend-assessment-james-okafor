import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Book Explorer",
    default: "Book Explorer — Discover Your Next Read",
  },
  description:
    "Browse millions of books from the Open Library. Search by title, author, or genre and explore rich book details.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://book-explorer.vercel.app",
  ),
  openGraph: {
    type: "website",
    siteName: "Book Explorer",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="page-container">
            <div className="flex items-center h-16 gap-3">
              {/* Book icon */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-7 h-7 text-brand-600 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              <a
                href="/"
                className="font-serif text-xl font-bold text-slate-900 hover:text-brand-700 transition-colors"
              >
                Book Explorer
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-slate-200 mt-16">
          <div className="page-container py-8 text-center text-sm text-slate-500">
            <p>
              Data sourced from{" "}
              <a
                href="https://openlibrary.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                Open Library
              </a>{" "}
              — a project of the Internet Archive.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

