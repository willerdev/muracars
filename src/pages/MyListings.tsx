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
            .select(`
              cars (*)
            `)
            .eq('user_id', user.id)
            .eq('is_owner', true);

          if (error) throw error;
          setVehicles(data.map(item => item.cars) as Vehicle[]);
        } else {
          const { data, error } = await supabase
            .from('spare_parts')
            .select('*')
            .eq('user_id', user.id);

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
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">My Listings</h1>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md ${
                activeTab === 'vehicles'
                  ? 'bg-black text-white'
                  : 'border-2 border-black text-black'
              }`}
            >
              <Car className="h-5 w-5" />
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('parts')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md ${
                activeTab === 'parts'
                  ? 'bg-black text-white'
                  : 'border-2 border-black text-black'
              }`}
            >
              <Package2 className="h-5 w-5" />
              Spare Parts
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-black" />
            </div>
          ) : activeTab === 'vehicles' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-gray-600 mb-4">${vehicle.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-vehicle/${vehicle.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        <PenSquare className="h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id, 'vehicles')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parts.map((part) => (
                <div key={part.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{part.name}</h3>
                    <p className="text-gray-600 mb-2">Category: {part.category}</p>
                    <p className="text-gray-600 mb-4">${part.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-part/${part.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        <PenSquare className="h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(part.id, 'parts')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100"
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
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                {activeTab === 'vehicles' ? <Car /> : <Package2 />}
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No listings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new listing.
              </p>
              <div className="mt-6">
                <Link
                  to="/sell"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                >
                  Create Listing
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}