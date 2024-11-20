import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Vehicle } from '../types';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader } from 'lucide-react';

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    delivery_preference: 'pickup', // or 'delivery'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('orders').insert({
        car_id: id,
        user_id: user?.id,
        ...formData,
        status: 'pending',
        total_amount: vehicle?.price || 0,
      });

      if (error) throw error;
      navigate('/profile/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip_code"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Preference
                </label>
                <select
                  name="delivery_preference"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.delivery_preference}
                  onChange={handleInputChange}
                >
                  <option value="pickup">Pickup from Dealership</option>
                  <option value="delivery">Home Delivery</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" />
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}