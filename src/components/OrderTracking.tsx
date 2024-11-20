import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, CheckCircle, Loader } from 'lucide-react';

interface OrderTrackingProps {
  userId: string;
}

export default function OrderTracking({ userId }: OrderTrackingProps) {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveOrders() {
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
          .in('status', ['pending', 'processing', 'shipped'])
          .order('created_at', { ascending: false });

        if (error) throw error;
        setActiveOrders(data || []);
      } catch (error) {
        console.error('Error fetching active orders:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveOrders();
  }, [userId]);

  const getStepStatus = (orderStatus: string, step: string) => {
    const steps = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 4
    };

    const currentStep = steps[orderStatus as keyof typeof steps];
    const stepNumber = steps[step as keyof typeof steps];

    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Active Orders</h3>
        <p className="mt-1 text-sm text-gray-500">
          All your orders have been delivered.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Order Tracking</h2>
      
      <div className="space-y-8">
        {activeOrders.map((order) => (
          <div key={order.id} className="border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={order.cars.image_url}
                alt={`${order.cars.make} ${order.cars.model}`}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold">
                  {order.cars.year} {order.cars.make} {order.cars.model}
                </h3>
                <p className="text-gray-600">
                  Order #{order.id}
                </p>
                <p className="text-gray-600">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-0.5 w-full bg-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${getStepStatus(order.status, step) === 'completed' ? 'bg-green-500' :
                        getStepStatus(order.status, step) === 'current' ? 'bg-blue-500' :
                        'bg-gray-200'
                      }
                    `}>
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="mt-2 capitalize text-sm">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
