# Book Explorer

A production-quality content explorer built on **Next.js 15 (App Router)**, **TypeScript strict**, and **Tailwind CSS**. Data is sourced from the [Open Library](https://openlibrary.org) API — no API key required.

## Live URL

> [Add Vercel deployment URL here after deployment]

---

## Quick Start

```bash
git clone https://github.com/Hamezry/frontend-assessment-james-okafor.git
cd frontend-assessment-james-okafor
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. Tests: `npm run test:run`.

---

## Architecture Decisions

### Folder structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── books/[id]/         # Dynamic work detail route
│   └── api/books/          # Edge API route (B-1)
├── components/             # Co-located component + styles
│   ├── BookCard/
│   │   ├── BookCard.tsx
│   │   └── __tests__/BookCard.test.tsx
│   ├── EmptyState/
│   │   ├── EmptyState.tsx
│   │   └── __tests__/EmptyState.test.tsx
│   ├── AuthorSection/      # Suspense-wrapped async server component (B-2)
│   └── Skeleton/           # Skeleton loaders (no spinners)
├── lib/
│   ├── api/openlibrary.ts  # ALL fetch calls — components never call fetch() directly
│   └── utils/cn.ts         # Tailwind class merger
├── hooks/
│   └── useDebounce.ts      # 350ms debounce for search
└── types/
    └── book.ts             # All shared TypeScript types, no inline reuse
```

### Why pagination over infinite scroll?

- URLs remain shareable at any page position (F-3 requirement)
- Users can jump directly to page N without scrolling
- Better for accessibility — screen readers can announce "page 3 of 47"
- Avoids `IntersectionObserver` complexity and layout jank on scroll
- Works correctly with the Back button (browser navigates to the exact page)

### Why Vercel over Cloudflare Workers?

Vercel's native Next.js integration is zero-config and avoids the OpenNext adapter's edge-case runtime differences (streaming, middleware, ISR). The Cloudflare edge caching strategy from B-1 is documented and implemented in the API route — the headers would work identically behind a Cloudflare proxy in front of Vercel.

### Data fetching strategy

All fetch calls live in `lib/api/openlibrary.ts`. Components receive typed data; they never import `fetch` directly. This makes the API layer mockable in tests and easy to swap (e.g. point to a different endpoint for staging).

---

## Performance Optimizations

### 1. `next/image` with explicit dimensions and `priority`

Every `<Image>` has explicit `width`/`height` or `fill` with `sizes`, preventing CLS. The first 8 cards on the listing page set `priority={true}` to eagerly load LCP images and avoid an unnecessary lazy-load deferral.

### 2. Next.js fetch cache settings

| Call             | Cache setting       | Reason                                                                                                              |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `searchBooks`    | `revalidate: 3600`  | Search results change over hours, not seconds. 1 h is fresh enough while avoiding a network hit on every page view. |
| `getWorkBasic`   | `revalidate: 86400` | Works (books) are immutable in practice. 24 h cache avoids redundant requests on repeated visits.                   |
| `getWorkAuthors` | `revalidate: 86400` | Same reasoning as works.                                                                                            |

### 3. Font optimization via `next/font`

`Inter` and `Playfair Display` are loaded through `next/font/google` with `display: 'swap'` and `subsets: ['latin']`. This eliminates the render-blocking Google Fonts network request and prevents invisible-text flash.

### 4. Field projection on search API

OpenLibrary's search endpoint supports a `fields` param. We project only the seven fields we render, reducing JSON payload size from ~40 KB to ~8 KB per page of results.

### 5. Image format optimization

`next.config.ts` enables `['image/avif', 'image/webp']` formats. Next.js serves AVIF (typically 50 % smaller than JPEG) to browsers that support it, falling back to WebP.

---

## Bonus Tasks

### B-1 — Edge Caching with Cache-Control headers

Implemented in `src/app/api/books/route.ts` (Edge Runtime).

The response includes:

```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
x-cache-status: MISS
```

**How to verify:**

```bash
curl -I https://<your-deployment>/api/books?q=fiction
# Look for x-cache-status: MISS on first hit
# Vercel CDN will add x-vercel-cache: HIT on subsequent hits from the same region
```

**Cloudflare Workers / OpenNext mapping:**

If the project were deployed on Cloudflare Workers via OpenNext:

| Next.js fetch option | OpenNext/Workers behaviour                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `revalidate: N`      | OpenNext sets `Cache-Control: s-maxage=N` on the sub-request; Workers honors this via `cf.cacheTtl`                                                   |
| `force-cache`        | OpenNext passes `cf: { cacheEverything: true }` on internal fetches                                                                                   |
| `no-store`           | Workers `Cache-Control: no-store` bypass                                                                                                              |
| `x-cache-status`     | You would check `caches.default.match(request)` in the Worker, return `HIT` if found, otherwise call the origin and `caches.default.put` the response |

### B-2 — React 18 Streaming with Suspense

The book detail page renders the work's title, cover, description, and metadata **immediately**. The `<AuthorSection>` component — which makes separate API calls for each author — is wrapped in a `<Suspense>` boundary:

```tsx
// src/app/books/[id]/page.tsx
<Suspense fallback={<AuthorSectionSkeleton />}>
  <AuthorSection authorKeys={work.authorKeys} />
</Suspense>
```

`AuthorSection` is a pure async Server Component. It `await`s `getWorkAuthors(authorKeys)` without any `useState` or `useEffect`. Next.js streams the fallback skeleton to the client while the Server Component resolves, then flushes the resolved HTML. No client-side loading state is involved.

### B-3 — Accessibility Audit

Target score: ≥ 95 Lighthouse accessibility.

**What was implemented:**

- All interactive elements have visible focus rings (`focus-visible` ring via Tailwind)
- Search input has `<label htmlFor>` with `sr-only` (not just `placeholder`)
- Filter `<select>` elements each have `sr-only` labels
- Pagination uses `aria-label="Pagination"`, `aria-current="page"`, `aria-label` on prev/next buttons
- Decorative icons use `aria-hidden="true"` throughout
- `EmptyState` uses `role="status"` and `aria-live="polite"` for dynamic announcement
- `BookGridSkeleton` uses `aria-busy="true"` and `aria-label="Loading books…"`
- Book cover images use empty `alt=""` (decorative; title link provides the accessible name)
- Color contrast: brand-600 (#c026d3) on white passes WCAG AA at all text sizes
- `lang="en"` on `<html>`
- Breadcrumb uses `<nav aria-label="Breadcrumb">` with `aria-current="page"` on last item

**Known remaining issues:**

- Open Library author bios can contain unsanitized HTML markup rendered as text — this is intentional (we never use `dangerouslySetInnerHTML`) but means some bios may contain visible angle brackets.

---

## Trade-offs & Known Limitations

| Area              | Decision                                         | What I'd do with more time                                                   |
| ----------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| State management  | `useState` + URL params only                     | For a real app with shopping cart / reading list, add Zustand                |
| Error granularity | Single `error.tsx` per segment                   | Add typed error classes to distinguish 404 vs 500 vs network timeout         |
| Testing           | 2 components at 100% coverage                    | Add integration tests with MSW to mock OpenLibrary API                       |
| Search            | Delegates to OpenLibrary's full-text search      | Build a local Fuse.js index for instant client-side search on cached results |
| Cloudflare        | Headers only, no actual Workers deployment       | Full OpenNext Cloudflare adapter setup with `caches.default` reads           |
| Cover images      | OpenLibrary covers can be missing for many books | Cross-reference Google Books API as fallback cover source                    |

---

## What I'd tackle next (2 more hours)

1. **MSW-based integration tests** — mock the OpenLibrary API at the network layer and test the full search + filter + pagination flow
2. **Reading list** — Zustand store persisted to `localStorage` so users can save books across sessions
3. **Cloudflare Workers deployment** — wire up OpenNext adapter and implement true `caches.default.match/put` edge caching with the `x-cache-status: HIT` header from the Worker itself

# frontend-assessment-james-okafor
