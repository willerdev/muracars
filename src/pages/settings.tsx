import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, fetchUserCars, fetchUserOrders } from '../lib/database';
import { Car, User, Settings, Package, Clock } from 'lucide-react';
import ListVehicleForm from '../components/ListVehicleForm';
import ProfileSettings from '../components/ProfileSettings';
import OrderHistory from '../components/OrderHistory';
import OrderTracking from '../components/OrderTracking';
import KYCVerification from '../components/KYCVerification';

type TabType = 'overview' | 'orders' | 'tracking' | 'settings' | 'verification';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userCars, setUserCars] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      const [profileData, carsData] = await Promise.all([
        fetchUserProfile(user.id),
        fetchUserCars(user.id)
      ]);
      
      setProfile(profileData);
      setUserCars(carsData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h2 className="font-semibold mb-2">Member Since</h2>
                  <p>
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString()
                      : '11/20/2024'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h2 className="font-semibold mb-2">Listed Cars</h2>
                  <p>{userCars.length} vehicles</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">My Listed Vehicles</h2>
                <button 
                  onClick={() => setIsListingModalOpen(true)}
                  className="flex items-center text-white bg-black px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  <Car className="h-5 w-5 mr-2" />
                  Post
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCars.map((car) => (
                  <div key={car.id} className="border rounded-lg p-4">
                    <img
                      src={car.cars.image_url}
                      alt={`${car.cars.make} ${car.cars.model}`}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold">
                      {car.cars.year} {car.cars.make} {car.cars.model}
                    </h3>
                    <p className="text-gray-600">
                      Listed on {new Date(car.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'orders':
        return <OrderHistory userId={user?.id || ''} />;
      case 'tracking':
        return <OrderTracking userId={user?.id || ''} />;
      case 'settings':
        return <ProfileSettings profile={profile} onUpdate={loadProfileData} />;
      case 'verification':
        return <KYCVerification onSuccess={loadProfileData} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">{profile?.username}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`${
                  activeTab === 'orders'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Package className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className={`${
                  activeTab === 'tracking'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Tracking
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`${
                  activeTab === 'settings'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Settings className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>

        {renderTabContent()}

        {isListingModalOpen && (
          <ListVehicleForm
            onClose={() => setIsListingModalOpen(false)}
            onSuccess={() => {
              setIsListingModalOpen(false);
              loadProfileData();
            }}
            userId={user?.id || ''}
          />
        )}
      </div>
    </div>
  );
}