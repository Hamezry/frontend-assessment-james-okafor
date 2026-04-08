const SKELETON_COUNT = 20;

export default function BookGridSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading books…"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-card flex flex-col"
        >
          {/* Cover placeholder */}
          <div className="skeleton aspect-book w-full" />
          {/* Text placeholders */}
          <div className="p-4 space-y-2.5">
            <div className="skeleton h-4 w-4/5 rounded" />
            <div className="skeleton h-3 w-3/5 rounded" />
            <div className="flex justify-between pt-2 border-t border-slate-100 mt-1">
              <div className="skeleton h-3 w-10 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

