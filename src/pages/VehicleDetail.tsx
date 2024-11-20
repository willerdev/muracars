import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Vehicle } from '../types';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Check, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VehicleDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVehicle() {
      if (!id) {
        setError('No vehicle ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setVehicle(data as Vehicle);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load vehicle details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchVehicle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The vehicle you're looking for doesn't exist."}</p>
          <Link 
            to="/" 
            className="text-black hover:text-gray-700 font-medium inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleMakeOrder = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/order/${vehicle?.id}`);
      return;
    }
    navigate(`/order/${vehicle?.id}`);
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={selectedImage || vehicle.image_url}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>
            
            {vehicle.gallery_images && vehicle.gallery_images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                <div 
                  className={`aspect-w-16 aspect-h-9 cursor-pointer relative ${
                    (!selectedImage || selectedImage === vehicle.image_url) ? 'ring-2 ring-black' : ''
                  }`}
                  onClick={() => setSelectedImage(vehicle.image_url)}
                >
                  <img
                    src={vehicle.image_url}
                    alt="Main"
                    className="w-full h-24 object-cover rounded-lg hover:opacity-80 transition"
                  />
                </div>
                {vehicle.gallery_images.map((image, index) => (
                  <div 
                    key={index}
                    className={`aspect-w-16 aspect-h-9 cursor-pointer relative ${
                      selectedImage === image ? 'ring-2 ring-black' : ''
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg hover:opacity-80 transition"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span>{vehicle.mileage.toLocaleString()} miles</span>
                <span>{vehicle.transmission}</span>
                <span>{vehicle.fuelType}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-3xl font-bold mb-4">
                ${vehicle.price.toLocaleString()}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleMakeOrder}
                  className="flex-1 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
                >
                  Make Order
                </button>
                <button
                  onClick={() => navigate(`/trade-in/${vehicle.id}`)}
                  className="flex-1 border-2 border-black text-black py-3 rounded-md hover:bg-black hover:text-white transition"
                >
                  Trade-In
                </button>
              </div>
            </div>

            {vehicle.features && vehicle.features.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                  {vehicle.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">
                {vehicle.description || 
                  `Experience luxury and performance in this exceptional ${vehicle.make} ${vehicle.model}. 
                  This ${vehicle.condition?.toLowerCase() || 'quality'} vehicle comes with a comprehensive warranty 
                  and has been thoroughly inspected to ensure the highest quality standards.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}