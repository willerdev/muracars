import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, fetchUserCars } from '../lib/database';
import { Car, User, Settings } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userCars, setUserCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    loadProfileData();
  }, [user]);

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
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Settings className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="font-semibold mb-2">Member Since</h2>
              <p>{new Date(profile?.created_at).toLocaleDateString()}</p>
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
            <button className="flex items-center text-white bg-black px-4 py-2 rounded-md hover:bg-gray-800">
              <Car className="h-5 w-5 mr-2" />
              List New Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCars.map((userCar) => (
              <div key={userCar.id} className="border rounded-lg p-4">
                <img
                  src={userCar.cars.image_url}
                  alt={`${userCar.cars.make} ${userCar.cars.model}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold">
                  {userCar.cars.year} {userCar.cars.make} {userCar.cars.model}
                </h3>
                <p className="text-gray-600">
                  Listed on {new Date(userCar.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}