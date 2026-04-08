import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from '../EmptyState';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('EmptyState', () => {
  it('shows query in heading when query is provided', () => {
    render(<EmptyState query="dune" hasFilters={true} />);
    expect(screen.getByRole('heading')).toHaveTextContent('No results for "dune"');
  });

  it('shows generic heading when no query', () => {
    render(<EmptyState query={undefined} hasFilters={false} />);
    expect(screen.getByRole('heading')).toHaveTextContent('No books found');
  });

  it('shows filter-adjustment hint when hasFilters is true', () => {
    render(<EmptyState query="xyz" hasFilters={true} />);
    expect(screen.getByText(/adjusting your search/i)).toBeInTheDocument();
  });

  it('shows search prompt when hasFilters is false', () => {
    render(<EmptyState query={undefined} hasFilters={false} />);
    expect(screen.getByText(/searching for a title/i)).toBeInTheDocument();
  });

  it('renders "Clear all filters" link only when hasFilters is true', () => {
    const { rerender } = render(<EmptyState query="a" hasFilters={true} />);
    expect(screen.getByRole('link', { name: /clear all filters/i })).toBeInTheDocument();

    rerender(<EmptyState query="a" hasFilters={false} />);
    expect(screen.queryByRole('link', { name: /clear all filters/i })).toBeNull();
  });

  it('always renders the Open Library fallback link', () => {
    render(<EmptyState hasFilters={false} />);
    const link = screen.getByRole('link', { name: /try open library/i });
    expect(link).toHaveAttribute('href', 'https://openlibrary.org');
  });

  it('has role="status" and aria-live for screen reader announcements', () => {
    render(<EmptyState hasFilters={false} />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });
});
