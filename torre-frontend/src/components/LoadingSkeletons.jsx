const skeletonClass = 'animate-pulse rounded bg-gray-200 dark:bg-gray-800';

const SkeletonBlock = ({ className = '' }) => (
  <div aria-hidden="true" className={`${skeletonClass} ${className}`} />
);

const SkeletonStatus = ({ label, children, className = '' }) => (
  <div role="status" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

const JobCardSkeleton = () => (
  <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="mt-3 h-4 w-1/2" />
      </div>
      <SkeletonBlock className="h-6 w-20 rounded-full" />
    </div>
    <div className="mt-5 space-y-2">
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-4 w-2/3" />
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <SkeletonBlock className="h-4 w-28" />
      <div className="flex gap-2">
        <SkeletonBlock className="h-8 w-20" />
        <SkeletonBlock className="h-8 w-16" />
      </div>
    </div>
  </article>
);

const ProfileCardSkeleton = () => (
  <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-start gap-4">
      <SkeletonBlock className="h-16 w-16 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="mt-3 h-4 w-1/2" />
        <SkeletonBlock className="mt-4 h-4 w-full" />
        <SkeletonBlock className="mt-2 h-4 w-4/5" />
      </div>
    </div>
    <div className="mt-5 flex gap-2">
      <SkeletonBlock className="h-9 w-20" />
      <SkeletonBlock className="h-9 w-16" />
    </div>
  </article>
);

const FavoriteCardSkeleton = () => (
  <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="mt-3 h-4 w-1/2" />
      </div>
      <SkeletonBlock className="h-12 w-12 rounded-full" />
    </div>
    <div className="mt-5 space-y-2">
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-4 w-2/3" />
    </div>
    <SkeletonBlock className="mt-5 h-9 w-24" />
  </article>
);

export const JobCardSkeletonGrid = ({ label, count = 4 }) => (
  <SkeletonStatus label={label} className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {Array.from({ length: count }, (_, index) => (
      <JobCardSkeleton key={index} />
    ))}
  </SkeletonStatus>
);

export const ProfileCardSkeletonGrid = ({ label, count = 6 }) => (
  <SkeletonStatus label={label} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }, (_, index) => (
      <ProfileCardSkeleton key={index} />
    ))}
  </SkeletonStatus>
);

export const FavoriteCardSkeletonGrid = ({ label, count = 3 }) => (
  <SkeletonStatus label={label} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }, (_, index) => (
      <FavoriteCardSkeleton key={index} />
    ))}
  </SkeletonStatus>
);

export const GenomeSkeleton = ({ label }) => (
  <SkeletonStatus label={label}>
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <SkeletonBlock className="h-24 w-24 rounded-full" />
        <div className="flex-1">
          <SkeletonBlock className="h-7 w-64 max-w-full" />
          <SkeletonBlock className="mt-4 h-4 w-80 max-w-full" />
          <SkeletonBlock className="mt-3 h-4 w-32" />
        </div>
      </div>
      <div className="mt-8">
        <SkeletonBlock className="h-5 w-32" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonBlock key={index} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="mt-8">
        <SkeletonBlock className="h-5 w-28" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <SkeletonBlock key={index} className="h-7 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </article>
  </SkeletonStatus>
);

export const AnalyticsSkeleton = ({ label }) => (
  <SkeletonStatus label={label}>
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <ul className="space-y-5">
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
            <SkeletonBlock className="h-3 w-full rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  </SkeletonStatus>
);
