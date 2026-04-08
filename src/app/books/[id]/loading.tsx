import AuthorSectionSkeleton from '@/components/Skeleton/AuthorSectionSkeleton';

export default function BookDetailLoading() {
  return (
    <div className="page-container py-8 sm:py-12">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="skeleton h-4 w-12" />
        <div className="skeleton h-4 w-3" />
        <div className="skeleton h-4 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 lg:gap-12">
        {/* Cover skeleton */}
        <div className="flex flex-col gap-4">
          <div className="skeleton aspect-book w-full max-w-[280px] mx-auto md:mx-0 rounded-xl" />
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 max-w-[280px] mx-auto md:mx-0 w-full">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-32" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-5 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div>
          <div className="skeleton h-10 w-3/4 mb-2" />
          <div className="skeleton h-8 w-1/2 mb-6" />

          <AuthorSectionSkeleton />

          <div className="mt-8 space-y-3">
            <div className="skeleton h-5 w-32 mb-3" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-4 w-full" />
            ))}
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
