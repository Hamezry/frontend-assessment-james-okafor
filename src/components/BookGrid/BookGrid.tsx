import BookCard from "@/components/BookCard/BookCard";
import type { BookCardData } from "@/types/book";

interface BookGridProps {
  books: BookCardData[];
}

export default function BookGrid({ books }: BookGridProps) {
  return (
    <section aria-label="Book results">
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        role="list"
      >
        {books.map((book, index) => (
          <li key={book.id} role="listitem">
            <BookCard book={book} priority={index < 8} />
          </li>
        ))}
      </ul>
    </section>
  );
}

