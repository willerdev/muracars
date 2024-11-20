import { Vehicle } from '../types';
import VehicleCard from './VehicleCard';
import VehicleCardSkeleton from './VehicleCardSkeleton';

interface VehicleGridProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export default function VehicleGrid({ vehicles, isLoading }: VehicleGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}