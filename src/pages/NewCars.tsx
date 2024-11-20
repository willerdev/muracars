import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';
import VehicleGrid from '../components/VehicleGrid';
import Filters from '../components/Filters';

export default function NewCars() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    condition: 'New',
    minPrice: 0,
    maxPrice: 0,
    make: '',
    transmission: '',
    fuelType: ''
  });

  useEffect(() => {
    async function fetchNewCars() {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('flag', 'import')
          .eq('condition', 'New');

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

  return (
    <div className="pt-16 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">New Cars</h1>
        
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