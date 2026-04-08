export interface BookSearchResult {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  edition_count?: number;
  ratings_average?: number;
  ratings_count?: number;
}

export interface SearchApiResponse {
  numFound: number;
  start: number;
  docs: BookSearchResult[];
}

export interface WorkApiResponse {
  key: string;
  title: string;
  description?: string | { type: string; value: string };
  subjects?: string[];
  authors?: Array<{ author: { key: string }; type: { key: string } }>;
  covers?: number[];
  first_publish_date?: string;
}

export interface AuthorApiResponse {
  key: string;
  name: string;
  bio?: string | { type: string; value: string };
  birth_date?: string;
  death_date?: string;
  photos?: number[];
}

export interface BookCardData {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublished: number | null;
  subjects: string[];
  editionCount: number;
}

export interface WorkBasicData {
  id: string;
  title: string;
  description: string | null;
  subjects: string[];
  coverUrl: string | null;
  firstPublishDate: string | null;
  authorKeys: string[];
}

export interface AuthorData {
  id: string;
  name: string;
  bio: string | null;
  birthDate: string | null;
  deathDate: string | null;
  photoUrl: string | null;
}

export const PAGE_SIZE = 20 as const;

export const SUBJECT_OPTIONS = [
  { label: "All Genres", value: "" },
  { label: "Fiction", value: "fiction" },
  { label: "Science Fiction", value: "science_fiction" },
  { label: "Mystery", value: "mystery_and_detective_stories" },
  { label: "History", value: "history" },
  { label: "Biography", value: "biography" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Science", value: "science" },
  { label: "Philosophy", value: "philosophy" },
] as const;

export const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Newest", value: "new" },
  { label: "Oldest", value: "old" },
  { label: "Rating", value: "rating" },
] as const;

export type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface SearchParams {
  q?: string;
  subject?: SubjectValue;
  sort?: SortValue;
  page?: string;
}

export interface SearchResult {
  books: BookCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

