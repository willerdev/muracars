export default function VehicleCardSkeleton() {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="h-48 bg-gray-200 animate-pulse" />
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="flex justify-between items-center mb-3">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }