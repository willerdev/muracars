import { Vehicle } from '../types';
import { Link } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <Link to={`/vehicle/${vehicle.id}`}>
        <div className="relative h-48">
          <img 
            src={vehicle.image} 
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold
              ${vehicle.condition === 'New' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {vehicle.condition}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold">${vehicle.price.toLocaleString()}</span>
            <span className="text-gray-600">{vehicle.mileage.toLocaleString()} mi</span>
          </div>
          
          <div className="flex gap-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded">{vehicle.transmission}</span>
            <span className="px-2 py-1 bg-gray-100 rounded">{vehicle.fuelType}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}