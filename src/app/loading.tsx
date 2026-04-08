import BookGridSkeleton from '@/components/Skeleton/BookGridSkeleton';

export default function HomeLoading() {
  return (
    <div className="page-container py-8 sm:py-12">
      {/* Hero skeleton */}
      <div className="mb-8">
        <div className="skeleton h-10 w-64 mb-2" />
        <div className="skeleton h-5 w-80" />
      </div>

      {/* Controls skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="skeleton h-11 flex-1 rounded-lg" />
        <div className="skeleton h-11 w-36 rounded-lg" />
        <div className="skeleton h-11 w-32 rounded-lg" />
      </div>

      {/* Result count skeleton */}
      <div className="skeleton h-4 w-48 mb-4" />

      {/* Grid skeleton */}
      <BookGridSkeleton />
    </div>
  );
}
