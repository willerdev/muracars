import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';
import VehicleGrid from '../components/VehicleGrid';
import Filters from '../components/Filters';
import { Filter } from 'lucide-react';

export default function UsedCars() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    make: '',
    transmission: '',
    fuelType: ''
  });

  useEffect(() => {
    async function fetchUsedCars() {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('flag', 'used');

        if (error) throw error;
        setVehicles(data as Vehicle[]);
      } catch (error) {
        console.error('Error fetching used cars:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsedCars();
  }, []);

  return (
    <div className="pt-16 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Used Cars</h2>
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 text-gray-600"
          >
            <Filter className="h-5 w-5" />
            Filter
          </button>
        </div>

        {/* Mobile Filter Dropdown */}
        {isMobileFilterOpen && (
          <div className="md:hidden mb-6">
            <select
              className="w-full border rounded-md p-2 mb-4"
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
            >
              <option value="">All Makes</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Audi">Audi</option>
              <option value="Tesla">Tesla</option>
            </select>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block md:w-1/4">
            <Filters filters={filters} setFilters={setFilters} />
          </div>
          <div className="w-full md:w-3/4">
            <VehicleGrid vehicles={vehicles} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}