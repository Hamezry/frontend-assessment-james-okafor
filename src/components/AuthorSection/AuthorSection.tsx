import Image from "next/image";
import { getWorkAuthors } from "@/lib/api/openlibrary";
import type { AuthorData } from "@/types/book";

interface AuthorSectionProps {
  authorKeys: string[];
}

export default async function AuthorSection({
  authorKeys,
}: AuthorSectionProps) {
  if (authorKeys.length === 0) return null;

  const authors = await getWorkAuthors(authorKeys);
  if (authors.length === 0) return null;

  return (
    <section aria-labelledby="authors-heading">
      <h2
        id="authors-heading"
        className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3"
      >
        {authors.length === 1 ? "Author" : "Authors"}
      </h2>
      <div className="flex flex-col gap-4">
        {authors.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </div>
    </section>
  );
}

function AuthorCard({ author }: { author: AuthorData }) {
  return (
    <div className="flex items-start gap-4">
      {/* Author photo */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 ring-2 ring-white shadow-md">
        {author.photoUrl ? (
          <Image
            src={author.photoUrl}
            alt={`Photo of ${author.name}`}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <InitialsAvatar name={author.name} />
        )}
      </div>

      {/* Author info */}
      <div className="min-w-0">
        <p className="font-semibold text-slate-900 text-sm leading-snug">
          {author.name}
        </p>

        {(author.birthDate || author.deathDate) && (
          <p className="text-xs text-slate-500 mt-0.5">
            {author.birthDate ?? "?"}
            {author.deathDate ? ` – ${author.deathDate}` : ""}
          </p>
        )}

        {author.bio && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {author.bio}
          </p>
        )}

        <a
          href={`https://openlibrary.org/authors/${author.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-brand-600 hover:underline mt-1 inline-block"
        >
          View on Open Library →
        </a>
      </div>
    </div>
  );
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center
                 bg-gradient-to-br from-brand-400 to-brand-600"
    >
      <span className="text-white text-sm font-bold">{initials}</span>
    </div>
  );
}

