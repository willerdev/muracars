import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { SparePart } from '../types';
import { supabase } from '../lib/supabase';
import { Package2, Loader, ShoppingCart } from 'lucide-react';

export default function SparePartsPage() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchParts() {
      try {
        const { data, error } = await supabase
          .from('spare_parts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setParts(data as SparePart[]);
      } catch (err) {
        console.error('Error fetching spare parts:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchParts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Package2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Spare Parts Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              We're currently updating our inventory. Please check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Spare Parts</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {parts.map((part) => (
            <div key={part.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={part.image}
                alt={part.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{part.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Category: {part.category}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Compatible with: {part.compatibility.join(', ')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${part.price}</span>
                  <button
                    onClick={() => addToCart({
                      id: part.id,
                      type: 'part',
                      name: part.name,
                      price: part.price,
                      image: part.image,
                      quantity: 1
                    })}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
