import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getWorkBasic } from "@/lib/api/openlibrary";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AuthorSection from "@/components/AuthorSection/AuthorSection";
import AuthorSectionSkeleton from "@/components/Skeleton/AuthorSectionSkeleton";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const work = await getWorkBasic(id);
    return {
      title: work.title,
      description:
        work.description?.slice(0, 160) ??
        `Explore ${work.title} on Book Explorer.`,
      openGraph: {
        title: work.title,
        description: work.description?.slice(0, 160) ?? undefined,
        images: work.coverUrl
          ? [{ url: work.coverUrl, width: 300, height: 450 }]
          : [],
      },
    };
  } catch {
    return { title: "Book Not Found" };
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  let work;
  try {
    work = await getWorkBasic(id);
  } catch {
    notFound();
  }

  const breadcrumbs = [
    { label: "Books", href: "/" },
    { label: work.title, href: `/books/${id}` },
  ];

  return (
    <div className="page-container py-8 sm:py-12">
      <Breadcrumb items={breadcrumbs} />

      <article className="mt-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 lg:gap-12">
        {/* Cover image */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-book w-full max-w-[280px] mx-auto md:mx-0 rounded-xl overflow-hidden shadow-xl bg-slate-100">
            {work.coverUrl ? (
              <Image
                src={work.coverUrl}
                alt={`Cover of ${work.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 280px, 280px"
                priority
              />
            ) : (
              <NoCover title={work.title} />
            )}
          </div>

          {/* Metadata panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 max-w-[280px] mx-auto md:mx-0 w-full">
            {work.firstPublishDate && (
              <MetaRow label="First published" value={work.firstPublishDate} />
            )}
            {work.subjects.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Subjects
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {work.subjects.slice(0, 8).map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-6">
            {work.title}
          </h1>

          <Suspense fallback={<AuthorSectionSkeleton />}>
            <AuthorSection authorKeys={work.authorKeys} />
          </Suspense>

          {/* Description */}
          {work.description ? (
            <section className="mt-8" aria-labelledby="description-heading">
              <h2
                id="description-heading"
                className="text-lg font-semibold text-slate-800 mb-3"
              >
                About this book
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                {work.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ) : (
            <div className="mt-8 rounded-xl bg-slate-50 border border-slate-200 p-6 text-center">
              <p className="text-slate-400 text-sm">
                No description available for this work.
              </p>
              <a
                href={`https://openlibrary.org/works/${work.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-brand-600 hover:underline"
              >
                View on Open Library →
              </a>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200">
            <a
              href={`https://openlibrary.org/works/${work.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600
                         text-white text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              View on Open Library
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}

function NoCover({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 p-4">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        className="w-12 h-12 text-brand-400 mb-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <p className="text-brand-700 text-xs font-medium text-center line-clamp-3">
        {title}
      </p>
    </div>
  );
}

