export default function TransactionSkeleton() {
    return (
      <div className="space-y-4 w-full max-w-md animate-pulse">
        {/* First Transaction */}
       

        <div className="flex flex-col space-y-1">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
  
        {/* Second Transaction */}
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
         
        </div>
      </div>
    )
  }
  
  