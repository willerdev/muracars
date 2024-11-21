import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';

import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NewCars() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    condition: 'New',
    minPrice: 0,
    maxPrice: 0,
    make: '',
    transmission: '',
    fuel_type: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNewCars() {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('flag', 'import');

        if (error) throw error;
        setVehicles(data as Vehicle[]);
      } catch (error) {
        console.error('Error fetching new cars:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNewCars();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const searchString = `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="pt-16 pb-20">
      <div className="px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search vehicles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {/* Mobile Vehicle Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-2">
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => navigate(`/cars/${vehicle.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={vehicle.image_url}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <h3 className="font-semibold text-sm truncate">
                    {vehicle.year} {vehicle.make}
                  </h3>
                  <p className="text-sm text-gray-600">{vehicle.model}</p>
                  <p className="text-sm font-bold mt-1">
                    ${vehicle.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredVehicles.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No vehicles found</p>
          </div>
        )}
      </div>
    </div>
  );
}