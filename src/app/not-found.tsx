import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-container py-20 flex flex-col items-center text-center gap-6">
      <p className="text-8xl font-serif font-bold text-brand-200 select-none">404</p>
      <div>
        <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-500">That page doesn&apos;t exist or has been moved.</p>
      </div>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium
                   hover:bg-brand-700 transition-colors"
      >
        Back to Book Explorer
      </Link>
    </div>
  );
}
