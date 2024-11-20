import { Vehicle } from '../types';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vehicleName: string;
}

function QuoteModal({ isOpen, onClose, vehicleId, vehicleName }: QuoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
          
          <h3 className="text-lg font-semibold mb-4">
            Get Quote for {vehicleName}
          </h3>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Your Name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Your Email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile*</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Your WhatsApp/Mobile No."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
              <select className="w-full border border-gray-300 rounded-md p-2" required>
                <option value="">Select Country</option>
                {/* Add country options */}
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="cif" className="mr-2" />
                <label htmlFor="cif" className="text-sm text-gray-600">
                  CIF price (including shipping & insurance)
                </label>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="condition" className="mr-2" />
                <label htmlFor="condition" className="text-sm text-gray-600">
                  Condition of the car
                </label>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="proforma" className="mr-2" />
                <label htmlFor="proforma" className="text-sm text-gray-600">
                  Please send Proforma Invoice of this unit
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
                placeholder="Enter Your Message"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Get Free Quote
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <img 
          src={vehicle.image_url} 
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
        
        <div className="flex gap-2 text-sm text-gray-600 mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded">{vehicle.transmission}</span>
          <span className="px-2 py-1 bg-gray-100 rounded">{vehicle.fuelType}</span>
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/vehicle/${vehicle.id}`}
            className="flex-1 bg-black text-white text-center py-2 rounded-md hover:bg-gray-800 transition"
          >
            View Details
          </Link>
          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className="flex-1 border-2 border-black text-black py-2 rounded-md hover:bg-black hover:text-white transition"
          >
            Get Quote
          </button>
        </div>
      </div>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        vehicleId={vehicle.id}
        vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />
    </div>
  );
}