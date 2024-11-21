import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Loader } from 'lucide-react';

interface KoreaOrderHistoryProps {
  userId: string;
}

export default function KoreaOrderHistory({ userId }: KoreaOrderHistoryProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchKoreaOrders() {
      try {
        const { data, error } = await supabase
          .from('korea_service_orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching Korea orders:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchKoreaOrders();
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
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Korea Service Orders</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start ordering products from Korea today.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Korea Service Orders</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg">
                {order.product_name}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order ID:</span>
                  <span className="ml-2">{order.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 capitalize">{order.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <span className="ml-2">{order.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Budget Range:</span>
                  <span className="ml-2">{order.budget_range}</span>
                </div>
                {order.tracking_number && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Tracking Number:</span>
                    <span className="ml-2">{order.tracking_number}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Ordered on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}