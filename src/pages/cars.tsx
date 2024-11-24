import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Check, 
  Loader,
  Share2,
  Heart,
 Calendar,
  Gauge,
  Fuel
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VehicleDetail() {
  const { id } = useParams();

  const { isAuthenticated } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const handleMakeOrder = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/order/${vehicle?.id}`);
      return;
    }
    navigate(`/order/${vehicle?.id}`);
  };

  const handleImageSwipe = (direction: 'next' | 'prev') => {
    if (!vehicle?.images) return;
    
    const allImages = [
      vehicle.image_url,
      ...(typeof vehicle.images === 'string' 
        ? vehicle.images.split(',').filter(Boolean) 
        : Array.isArray(vehicle.images) 
          ? vehicle.images 
          : []
      )
    ];
    let newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % allImages.length
      : (currentImageIndex - 1 + allImages.length) % allImages.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

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
        <div className="text-center px-4">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative pt-14">
        <div className="relative h-72 bg-gray-100">
          <img
            src={selectedImage || vehicle.image_url}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => handleImageSwipe('prev')}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            ←
          </button>
          <button 
            onClick={() => handleImageSwipe('next')}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            →
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex gap-1.5">
              {[vehicle.image_url, ...(typeof vehicle.images === 'string' 
                ? vehicle.images.split(',').filter(Boolean) 
                : Array.isArray(vehicle.images) 
                  ? vehicle.images 
                  : []
              )].map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full ${
                    currentImageIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="px-4 py-4 mb-20">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${vehicle.price.toLocaleString()}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-xl flex flex-col items-center">
            <Calendar className="h-5 w-5 text-gray-600 mb-1" />
            <span className="text-sm font-medium">{vehicle.year}</span>
          </div>
          <div className="bg-white p-3 rounded-xl flex flex-col items-center">
            <Gauge className="h-5 w-5 text-gray-600 mb-1" />
            <span className="text-sm font-medium">{vehicle.mileage.toLocaleString()}</span>
          </div>
          <div className="bg-white p-3 rounded-xl flex flex-col items-center">
            <Fuel className="h-5 w-5 text-gray-600 mb-1" />
            <span className="text-sm font-medium">{vehicle.fuel_type}</span>
          </div>
        </div>

        {/* Features */}
        {vehicle.features && typeof vehicle.features === 'string' ? (
          vehicle.features.split(',').map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">{feature}</span>
            </div>
          ))
        ) : Array.isArray(vehicle.features) ? (
          vehicle.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-4 w-4 text-gray-900 mr-2" />
              <span className="text-sm">{feature}</span>
            </div>
          ))
        ) : null}

        {/* Description */}
        {/* <div className="mb-20">
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-600">
              {vehicle.features || 
                `Experience luxury and performance in this exceptional ${vehicle.make} ${vehicle.model}. 
                This ${vehicle.flag?.toLowerCase() || 'quality'} vehicle comes with a comprehensive warranty 
                and has been thoroughly inspected to ensure the highest quality standards.`}
            </p>
          </div>
        </div> */}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-12 left-0 right-0 bg-white border-t px-4 py-3 flex gap-3">
        <button
          onClick={() => navigate(`/trade-in/${vehicle.id}`)}
          className="flex-1 border-2 border-black text-black py-3 rounded-xl font-medium"
        >
          Trade-In
        </button>
        <button
          onClick={handleMakeOrder}
          className="flex-1 bg-black text-white py-3 rounded-xl font-medium"
        >
          Make Order
        </button>
      </div>
    </div>
  );
}