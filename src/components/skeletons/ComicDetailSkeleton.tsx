export function ComicDetailSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12 sm:flex-row sm:items-start sm:px-6 lg:px-8">
            <div className="h-[250px] w-[200px] flex-shrink-0 rounded-lg bg-gray-200 sm:h-[300px] sm:w-[220px]"></div>
            <div className="flex flex-1 flex-col w-full text-center sm:text-left items-center sm:items-start">
                <div className="mb-2 h-4 w-20 bg-gray-200 rounded"></div>
                <div className="mb-2 h-10 w-3/4 max-w-md bg-gray-200 rounded"></div>
                <div className="mb-6 h-5 w-1/3 bg-gray-200 rounded"></div>
                
                <div className="flex items-center justify-center gap-6 sm:justify-start w-full">
                     <div className="flex flex-col items-center sm:items-start gap-1">
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </div>
                     <div className="h-8 w-px bg-gray-200"></div>
                     <div className="flex flex-col items-center sm:items-start gap-1">
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                </div>

                 <div className="mt-8 w-full max-w-2xl bg-gray-200 h-24 rounded"></div>
                 
                 <div className="mt-8 flex justify-center gap-4 sm:justify-start w-full">
                    <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                 </div>
            </div>
        </div>
      </div>

      {/* Episode List Skeleton */}
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
         <div className="mb-4 h-6 w-32 bg-gray-200 rounded"></div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-gray-200"></div>
            ))}
         </div>
      </div>
    </div>
  );
}
