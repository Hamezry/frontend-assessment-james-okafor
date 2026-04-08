export default function AuthorSectionSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading author information…">
      <div className="skeleton h-3.5 w-16 mb-3 rounded" />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-start gap-4 mb-4">
          <div className="skeleton w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="skeleton h-3.5 w-32 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-3 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

