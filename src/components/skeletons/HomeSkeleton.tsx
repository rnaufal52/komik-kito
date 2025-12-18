export function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-10 pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative h-[400px] w-full bg-gray-200 sm:h-[460px]">
        <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
            <div className="mb-2 h-6 w-24 bg-gray-300 rounded"></div>
            <div className="mb-2 h-10 w-3/4 max-w-lg bg-gray-300 rounded"></div>
            <div className="mb-6 h-4 w-1/2 max-w-md bg-gray-300 rounded"></div>
            <div className="h-12 w-32 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Popular Section Skeleton */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                 <div className="h-8 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-3">
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <div className="aspect-[2/3] w-full rounded-md bg-gray-200"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
      </div>

       {/* Newest Section Skeleton */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                 <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
             <div className="flex gap-3">
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <div className="aspect-[2/3] w-full rounded-md bg-gray-200"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
