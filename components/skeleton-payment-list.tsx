import { Card } from "@/components/ui/card"

export default function SkeletonPaymentList() {
  return (
    <Card className="w-full max-w-md p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          {/* Reference number skeleton */}
          <div className="h-4 bg-muted animate-pulse rounded w-32" />
          {/* Date skeleton */}
          <div className="h-3 bg-muted animate-pulse rounded w-24" />
        </div>
        <div className="space-y-2 text-right">
          {/* Amount skeleton */}
          <div className="h-4 bg-muted animate-pulse rounded w-20 ml-auto" />
          {/* Components skeleton */}
          <div className="h-3 bg-muted animate-pulse rounded w-28 ml-auto" />
        </div>
      </div>

      {/* Divider line */}
      <div className="h-px bg-border" />

      {/* Components list skeleton */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-muted animate-pulse rounded w-24" />
          <div className="h-3 bg-muted animate-pulse rounded w-20" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-muted animate-pulse rounded w-24" />
          <div className="h-3 bg-muted animate-pulse rounded w-16" />
        </div>
      </div>
    </Card>
  )
}

