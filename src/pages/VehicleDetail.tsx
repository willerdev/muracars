import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { vehicles } from '../data/vehicles';
import { ArrowLeft, Check } from 'lucide-react';

export default function VehicleDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: vehicle.id,
      type: 'vehicle',
      name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      price: vehicle.price,
      image: vehicle.image
    });
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
                src={vehicle.image}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>
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
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                {[
                  'LED Headlights',
                  'Navigation System',
                  'Leather Seats',
                  'Parking Sensors',
                  'Bluetooth',
                  'Climate Control'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">
                Experience luxury and performance in this exceptional {vehicle.make} {vehicle.model}. 
                This {vehicle.condition.toLowerCase()} vehicle comes with a comprehensive warranty 
                and has been thoroughly inspected to ensure the highest quality standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}