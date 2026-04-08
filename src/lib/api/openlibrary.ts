import type {
  SearchApiResponse,
  BookSearchResult,
  WorkApiResponse,
  AuthorApiResponse,
  BookCardData,
  WorkBasicData,
  AuthorData,
  SearchResult,
  PAGE_SIZE,
} from "@/types/book";

// Runtime configuration can be overridden locally via `.env.local`.
// Next.js automatically loads `NEXT_PUBLIC_*` values into the client and server.
const BASE_URL =
  process.env.NEXT_PUBLIC_OL_BASE_URL ?? "https://openlibrary.org";
const COVERS_URL =
  process.env.NEXT_PUBLIC_OL_COVERS_URL ?? "https://covers.openlibrary.org";
const ITEMS_PER_PAGE = 20;

function buildCoverUrl(
  coverId: number | undefined,
  size: "S" | "M" | "L" = "M",
): string | null {
  if (!coverId) return null;
  return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}

function extractId(key: string): string {
  return key.split("/").pop() ?? key;
}

function normalizeText(
  field: string | { type: string; value: string } | undefined,
): string | null {
  if (!field) return null;
  if (typeof field === "string") return field;
  return field.value ?? null;
}

function toBookCardData(doc: BookSearchResult): BookCardData {
  return {
    id: extractId(doc.key),
    title: doc.title,
    authors: doc.author_name ?? [],
    coverUrl: buildCoverUrl(doc.cover_i),
    firstPublished: doc.first_publish_year ?? null,
    subjects: (doc.subject ?? []).slice(0, 5),
    editionCount: doc.edition_count ?? 0,
  };
}

export interface SearchBooksParams {
  query?: string;
  subject?: string;
  sort?: string;
  page?: number;
}

export async function searchBooks(
  params: SearchBooksParams,
): Promise<SearchResult> {
  const { query = "", subject, sort, page = 1 } = params;

  const url = new URL(`${BASE_URL}/search.json`);

  const parts: string[] = [];
  if (query) parts.push(query);
  if (subject) parts.push(`subject:${subject}`);
  url.searchParams.set("q", parts.length > 0 ? parts.join(" ") : "fiction");
  url.searchParams.set("limit", String(ITEMS_PER_PAGE));
  url.searchParams.set("offset", String((page - 1) * ITEMS_PER_PAGE));

  url.searchParams.set(
    "fields",
    "key,title,author_name,cover_i,first_publish_year,subject,edition_count",
  );
  if (sort) url.searchParams.set("sort", sort);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`OpenLibrary search failed with status ${res.status}`);
  }

  const data: SearchApiResponse = await res.json();

  return {
    books: data.docs.map(toBookCardData),
    total: data.numFound,
    page,
    pageSize: ITEMS_PER_PAGE,
    totalPages: Math.ceil(data.numFound / ITEMS_PER_PAGE),
  };
}

export async function getWorkBasic(id: string): Promise<WorkBasicData> {
  const res = await fetch(`${BASE_URL}/works/${id}.json`, {
    next: { revalidate: 86400 }, // 24 h — works are stable
  });

  if (!res.ok) {
    throw new Error(`Work "${id}" not found (${res.status})`);
  }

  const work: WorkApiResponse = await res.json();

  return {
    id,
    title: work.title,
    description: normalizeText(work.description),
    subjects: (work.subjects ?? []).slice(0, 12),
    coverUrl: buildCoverUrl(work.covers?.[0], "L"),
    firstPublishDate: work.first_publish_date ?? null,
    authorKeys: (work.authors ?? []).map((a) => a.author.key),
  };
}

export async function getWorkAuthors(
  authorKeys: string[],
): Promise<AuthorData[]> {
  const fetches = authorKeys
    .slice(0, 4)
    .map(async (key): Promise<AuthorData> => {
      const authorId = extractId(key);
      try {
        const res = await fetch(`${BASE_URL}/authors/${authorId}.json`, {
          next: { revalidate: 86400 },
        });
        if (!res.ok)
          return {
            id: authorId,
            name: "Unknown Author",
            bio: null,
            birthDate: null,
            deathDate: null,
            photoUrl: null,
          };
        const data: AuthorApiResponse = await res.json();
        return {
          id: authorId,
          name: data.name,
          bio: normalizeText(data.bio),
          birthDate: data.birth_date ?? null,
          deathDate: data.death_date ?? null,
          photoUrl: buildCoverUrl(data.photos?.[0], "S"),
        };
      } catch {
        return {
          id: authorId,
          name: "Unknown Author",
          bio: null,
          birthDate: null,
          deathDate: null,
          photoUrl: null,
        };
      }
    });

  return Promise.all(fetches);
}

