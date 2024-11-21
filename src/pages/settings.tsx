import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, fetchUserCars, fetchUserOrders } from '../lib/database';
import { Car, User, Settings, Package, Clock, Shield, ChevronRight } from 'lucide-react';
import ListVehicleForm from '../components/ListVehicleForm';
import ProfileSettings from '../components/ProfileSettings';
import OrderHistory from '../components/OrderHistory';
import OrderTracking from '../components/OrderTracking';
import KYCVerification from '../components/KYCVerification';
import { useNavigate } from 'react-router-dom';

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{profile?.username}</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Member Since</p>
          <p className="text-lg font-semibold">
            {profile?.created_at 
              ? new Date(profile.created_at).toLocaleDateString()
              : '11/20/2024'}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Listed Cars</p>
          <p className="text-lg font-semibold">{userCars.length}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-3">
        <button
          onClick={() => setActiveTab('overview')}
          className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Car className="h-5 w-5 text-gray-600" />
            <span>My Vehicles</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-gray-600" />
            <span>Orders</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <span>Track Orders</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5 text-gray-600" />
            <span>Settings</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-gray-600" />
            <span>KYC Verification</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Listed Vehicles Section */}
      {activeTab === 'overview' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Listed Vehicles</h2>
            <button 
              onClick={() => setIsListingModalOpen(true)}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Add New
            </button>
          </div>
          
          <div className="space-y-4">
            {userCars.map((car) => (
              <div key={car.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={car.cars.image_url}
                  alt={`${car.cars.make} ${car.cars.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">
                    {car.cars.year} {car.cars.make} {car.cars.model}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Listed on {new Date(car.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Tab Content */}
      {activeTab === 'orders' && <OrderHistory userId={user?.id || ''} />}
      {activeTab === 'tracking' && <OrderTracking userId={user?.id || ''} />}
      {activeTab === 'settings' && <ProfileSettings profile={profile} onUpdate={loadProfileData} />}
      {activeTab === 'verification' && <KYCVerification onSuccess={loadProfileData} />}

      {/* List Vehicle Modal */}
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
  );
}