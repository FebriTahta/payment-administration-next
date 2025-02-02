export default function CountdownSkeleton() {
    return (
      <div className="flex flex-col items-center justify-center space-y-1 p-4">
        {/* Timer skeleton */}
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md dark:bg-gray-700" />
        {/* Message skeleton */}
        <div className="h-4 w-64 bg-gray-200 animate-pulse rounded-md dark:bg-gray-700" />
      </div>
    )
  }
  
  