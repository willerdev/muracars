import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader, ArrowLeft } from 'lucide-react';

export default function KoreaOrderService() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    product_name: '',
    product_type: '',
    product_link: '',
    quantity: 1,
    budget_range: '',
    shipping_address: '',
    destination_country: '',
    preferred_shipping: 'sea',
    additional_notes: '',
    contact_number: '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('korea_orders').insert({
        user_id: user?.id,
        ...formData,
      });

      if (error) throw error;

      navigate('/profile', {
        state: { message: 'Order request submitted successfully!' }
      });
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('Failed to submit order request');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold mb-6">Order from Korea</h1>
          <p className="text-gray-600 mb-8">
            Fill out the form below to request a product from Korea. We'll handle the sourcing and shipping for you.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.product_name}
                  onChange={e => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                  placeholder="e.g. Samsung TV, Hyundai Parts"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type*
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.product_type}
                  onChange={e => setFormData(prev => ({ ...prev, product_type: e.target.value }))}
                >
                  <option value="">Select Product Type</option>
                  <option value="electronics">Electronics</option>
                  <option value="auto_parts">Auto Parts</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="fashion">Fashion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Link (Optional)
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.product_link}
                  onChange={e => setFormData(prev => ({ ...prev, product_link: e.target.value }))}
                  placeholder="https://example.com/product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity*
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.quantity}
                  onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range*
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.budget_range}
                  onChange={e => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                >
                  <option value="">Select Budget Range</option>
                  <option value="0-1000">$0 - $1,000</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000+">$10,000+</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address*
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.shipping_address}
                  onChange={e => setFormData(prev => ({ ...prev, shipping_address: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Country*
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.destination_country}
                  onChange={e => setFormData(prev => ({ ...prev, destination_country: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Shipping Method*
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.preferred_shipping}
                  onChange={e => setFormData(prev => ({ ...prev, preferred_shipping: e.target.value }))}
                >
                  <option value="sea">Sea Freight</option>
                  <option value="air">Air Freight</option>
                  <option value="express">Express Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number*
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.contact_number}
                  onChange={e => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={formData.additional_notes}
                  onChange={e => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                  placeholder="Any specific requirements or details about the product..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Submitting Order...
                  </span>
                ) : (
                  'Submit Order Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}