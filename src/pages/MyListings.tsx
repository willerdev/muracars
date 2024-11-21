import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Vehicle, SparePart } from '../types';
import { Car, Package2, Loader, PenSquare, Trash2 } from 'lucide-react';

type ListingType = 'vehicles' | 'parts';

export default function MyListings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ListingType>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [parts, setParts] = useState<SparePart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    async function fetchListings() {
      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === 'vehicles') {
          const { data, error } = await supabase
            .from('user_cars')
            .select(`cars (*)`)
            .eq('user_id', user?.id)
            .eq('is_owner', true);

          if (error) throw error;
          setVehicles(data?.map(item => item.cars as Vehicle) ?? []);
        } else {
          const { data, error } = await supabase
            .from('spare_parts')
            .select('*')
            .eq('user_id', user?.id);

          if (error) throw error;
          setParts(data as SparePart[]);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [user, activeTab]);

  const handleDelete = async (id: string, type: ListingType) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      if (type === 'vehicles') {
        const { error } = await supabase
          .from('user_cars')
          .delete()
          .eq('car_id', id)
          .eq('user_id', user?.id);

        if (error) throw error;
        setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      } else {
        const { error } = await supabase
          .from('spare_parts')
          .delete()
          .eq('id', id)
          .eq('user_id', user?.id);

        if (error) throw error;
        setParts(prev => prev.filter(part => part.id !== id));
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete listing');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4">My Listings</h1>

            {/* Tab Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm md:text-base transition-colors ${
                  activeTab === 'vehicles'
                    ? 'bg-black text-white'
                    : 'border-2 border-black text-black'
                }`}
              >
                <Car className="h-4 w-4 md:h-5 md:w-5" />
                Vehicles
              </button>
              <button
                onClick={() => setActiveTab('parts')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm md:text-base transition-colors ${
                  activeTab === 'parts'
                    ? 'bg-black text-white'
                    : 'border-2 border-black text-black'
                }`}
              >
                <Package2 className="h-4 w-4 md:h-5 md:w-5" />
                Parts
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-black" />
              </div>
            ) : activeTab === 'vehicles' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                      <img
                        src={vehicle.image_url}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold text-base md:text-lg mb-1">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base mb-3">
                        ${vehicle.price.toLocaleString()}
                      </p>
                      <div className="flex gap-2 text-sm">
                        <Link
                          to={`/edit-vehicle/${vehicle.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          <PenSquare className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(vehicle.id, 'vehicles')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {parts.map((part) => (
                  <div key={part.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                      <img
                        src={part.image}
                        alt={part.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold text-base md:text-lg mb-1">{part.name}</h3>
                      <p className="text-gray-600 text-sm mb-1">Category: {part.category}</p>
                      <p className="text-gray-600 text-sm md:text-base mb-3">
                        ${part.price.toLocaleString()}
                      </p>
                      <div className="flex gap-2 text-sm">
                        <Link
                          to={`/edit-part/${part.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          <PenSquare className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(part.id, 'parts')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {((activeTab === 'vehicles' && vehicles.length === 0) ||
              (activeTab === 'parts' && parts.length === 0)) && (
              <div className="text-center py-8 md:py-12">
                <div className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400">
                  {activeTab === 'vehicles' ? <Car /> : <Package2 />}
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No listings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new listing.
                </p>
                <div className="mt-4">
                  <Link
                    to="/sell"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
                  >
                    Create Listing
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}