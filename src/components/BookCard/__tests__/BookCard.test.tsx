import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BookCard from "../BookCard";
import type { BookCardData } from "@/types/book";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// next/link renders an <a> in tests
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const baseBook: BookCardData = {
  id: "OL1234W",
  title: "The Hobbit",
  authors: ["J.R.R. Tolkien"],
  coverUrl: "https://covers.openlibrary.org/b/id/1234-M.jpg",
  firstPublished: 1937,
  subjects: ["Fantasy", "Adventure"],
  editionCount: 42,
};

describe("BookCard", () => {
  it("renders the book title as a link to the detail page", () => {
    render(<BookCard book={baseBook} />);
    const links = screen.getAllByRole("link", { name: /The Hobbit/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "/books/OL1234W");
  });

  it("renders author name", () => {
    render(<BookCard book={baseBook} />);
    expect(screen.getByText("J.R.R. Tolkien")).toBeInTheDocument();
  });

  it("renders cover image when coverUrl is provided", () => {
    render(<BookCard book={baseBook} />);

    const img = document.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", baseBook.coverUrl);
  });

  it("renders placeholder when coverUrl is null", () => {
    render(<BookCard book={{ ...baseBook, coverUrl: null }} />);
    expect(document.querySelector("img")).toBeNull();

    expect(screen.getAllByText("The Hobbit").length).toBeGreaterThan(0);
  });

  it("renders publication year and edition count", () => {
    render(<BookCard book={baseBook} />);
    expect(screen.getByText("1937")).toBeInTheDocument();
    expect(screen.getByText("42 editions")).toBeInTheDocument();
  });

  it("omits year and editions when they are missing", () => {
    render(
      <BookCard
        book={{ ...baseBook, firstPublished: null, editionCount: 0 }}
      />,
    );
    expect(screen.queryByText("1937")).toBeNull();
    expect(screen.queryByText(/edition/)).toBeNull();
  });

  it('shows singular "edition" for editionCount of 1', () => {
    render(<BookCard book={{ ...baseBook, editionCount: 1 }} />);
    expect(screen.getByText("1 edition")).toBeInTheDocument();
  });

  it("renders up to two authors", () => {
    render(
      <BookCard
        book={{ ...baseBook, authors: ["Author A", "Author B", "Author C"] }}
      />,
    );
    expect(screen.getByText("Author A, Author B")).toBeInTheDocument();
  });

  it("handles empty authors array gracefully", () => {
    render(<BookCard book={{ ...baseBook, authors: [] }} />);
    // Should render without crashing; no author text
    expect(screen.queryByText("J.R.R. Tolkien")).toBeNull();
  });
});

