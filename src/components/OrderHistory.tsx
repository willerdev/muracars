import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Loader } from 'lucide-react';

interface OrderHistoryProps {
  userId: string;
}

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            cars (
              make,
              model,
              year,
              image_url
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Orders Yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start browsing our collection of premium vehicles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Order History</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <img
                src={order.cars.image_url}
                alt={`${order.cars.make} ${order.cars.model}`}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold">
                  {order.cars.year} {order.cars.make} {order.cars.model}
                </h3>
                <p className="text-gray-600">
                  Order placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Status: <span className="capitalize">{order.status}</span>
                </p>
                <p className="font-semibold mt-2">
                  Total: ${order.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
