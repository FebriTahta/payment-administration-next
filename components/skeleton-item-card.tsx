import { Skeleton } from "@/components/ui/skeleton"
import {cn} from "@/lib/utils"

export default function SkeletonItemCard() {
  return (
    <div className={cn('p-4 space-y-2 border rounded-lg mb-2')}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Menu icon skeleton */}
          <Skeleton className="h-5 w-5" />
          
          <div className="space-y-1.5">
            {/* Title skeleton */}
            <Skeleton className="h-4 w-28" />
            {/* Date skeleton */}
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        
        <div className="text-right space-y-1.5">
          {/* Status skeleton */}
          <Skeleton className="h-4 w-16 ml-auto" />
          {/* Time skeleton */}
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>
      </div>
    </div>
  )
}

