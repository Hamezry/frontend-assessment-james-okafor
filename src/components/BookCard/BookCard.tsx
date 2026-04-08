import Image from 'next/image';
import Link from 'next/link';
import type { BookCardData } from '@/types/book';
import { cn } from '@/lib/utils/cn';

interface BookCardProps {
  book: BookCardData;
  priority?: boolean;
}

export default function BookCard({ book, priority = false }: BookCardProps) {
  const href = `/books/${book.id}`;

  return (
    <article
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden border border-slate-200',
        'shadow-card hover:shadow-card-hover transition-shadow duration-300',
        'flex flex-col',
      )}
    >
      {/* Cover */}
      <Link href={href} className="block flex-shrink-0" aria-hidden="true" tabIndex={-1}>
        <div className="relative aspect-book w-full bg-slate-100">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt=""
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
            />
          ) : (
            <NoCoverPlaceholder title={book.title} />
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Title — main link for accessibility */}
        <h2 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
          <Link
            href={href}
            className="hover:text-brand-700 transition-colors focus-visible:underline"
          >
            {book.title}
          </Link>
        </h2>

        {/* Authors */}
        {book.authors.length > 0 && (
          <p className="text-xs text-slate-500 line-clamp-1">
            {book.authors.slice(0, 2).join(', ')}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100">
          {book.firstPublished && (
            <span className="text-xs text-slate-400">{book.firstPublished}</span>
          )}
          {book.editionCount > 0 && (
            <span className="text-xs text-slate-400 ml-auto">
              {book.editionCount} {book.editionCount === 1 ? 'edition' : 'editions'}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function NoCoverPlaceholder({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col items-center justify-center
                 bg-gradient-to-br from-brand-50 to-brand-100 p-3"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        className="w-8 h-8 text-brand-300 mb-2 flex-shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <p className="text-brand-600 text-xs font-medium text-center line-clamp-3 leading-snug">
        {title}
      </p>
    </div>
  );
}
