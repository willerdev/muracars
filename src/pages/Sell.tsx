import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Vehicle } from '../types';
import { X, Upload, Loader, Car, Package2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadFile } from '../lib/storage';

type ListingType = 'vehicle' | 'part';

export default function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listingType, setListingType] = useState<ListingType>('vehicle');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    condition: 'Used' as Vehicle['condition'],
    transmission: 'Automatic' as Vehicle['transmission'],
    fuelType: 'Petrol' as Vehicle['fuelType'],
    description: '',
    image_url: '',
    gallery_images: [] as string[],
    flag: 'used' as 'used'
  });

  // Spare part form state
  const [partForm, setPartForm] = useState({
    name: '',
    category: '',
    price: 0,
    compatibility: [] as string[],
    description: '',
    image: '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(e.target.files)) {
        const publicUrl = await uploadFile(file, `${listingType}-listings`);
        uploadedUrls.push(publicUrl);
      }

      if (listingType === 'vehicle') {
        setVehicleForm(prev => ({
          ...prev,
          image_url: uploadedUrls[0],
          gallery_images: uploadedUrls.slice(1)
        }));
      } else {
        setPartForm(prev => ({
          ...prev,
          image: uploadedUrls[0]
        }));
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .insert({
          ...vehicleForm,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (carError) throw carError;

      const { error: userCarError } = await supabase
        .from('user_cars')
        .insert({
          user_id: user?.id,
          car_id: carData.id,
          is_owner: true
        });

      if (userCarError) throw userCarError;

      navigate('/profile', { 
        state: { message: 'Vehicle listed successfully!' }
      });
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: partError } = await supabase
        .from('spare_parts')
        .insert({
          ...partForm,
          user_id: user?.id,
          created_at: new Date().toISOString()
        });

      if (partError) throw partError;

      navigate('/profile', { 
        state: { message: 'Spare part listed successfully!' }
      });
    } catch (err) {
      console.error('Error creating spare part listing:', err);
      setError('Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Sell on Muracars</h1>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setListingType('vehicle')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md ${
                listingType === 'vehicle'
                  ? 'bg-black text-white'
                  : 'border-2 border-black text-black'
              }`}
            >
              <Car className="h-5 w-5" />
              Vehicle
            </button>
            <button
              onClick={() => setListingType('part')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md ${
                listingType === 'part'
                  ? 'bg-black text-white'
                  : 'border-2 border-black text-black'
              }`}
            >
              <Package2 className="h-5 w-5" />
              Spare Part
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {listingType === 'vehicle' ? (
            <form onSubmit={handleVehicleSubmit} className="space-y-6">
              {/* Reuse the vehicle form fields from ListVehicleForm component */}
              {/* Reference the fields from ListVehicleForm.tsx */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={vehicleForm.make}
                    onChange={e => setVehicleForm(prev => ({ ...prev, make: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={vehicleForm.model}
                    onChange={e => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={vehicleForm.year}
                    onChange={e => setVehicleForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={vehicleForm.price}
                    onChange={e => setVehicleForm(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mileage
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={vehicleForm.mileage}
                    onChange={e => setVehicleForm(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={vehicleForm.condition}
                    onChange={e => setVehicleForm(prev => ({ ...prev, condition: e.target.value as Vehicle['condition'] }))}
                  >
                    <option value="Used">Used</option>
                    <option value="New">New</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transmission
                  </label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={vehicleForm.transmission}
                    onChange={e => setVehicleForm(prev => ({ ...prev, transmission: e.target.value as Vehicle['transmission'] }))}
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Type
                  </label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={vehicleForm.fuelType}
                    onChange={e => setVehicleForm(prev => ({ ...prev, fuelType: e.target.value as Vehicle['fuelType'] }))}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Image upload section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Images
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700">
                        <span>Upload images</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={uploadingImages}
                          required={!vehicleForm.image_url}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                {uploadingImages && (
                  <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Uploading images...
                  </div>
                )}

                {(vehicleForm.image_url || vehicleForm.gallery_images.length > 0) && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {vehicleForm.image_url && (
                      <img
                        src={vehicleForm.image_url}
                        alt="Main vehicle image"
                        className="h-24 w-full object-cover rounded-lg"
                      />
                    )}
                    {vehicleForm.gallery_images.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Vehicle image ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || uploadingImages}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Creating Listing...
                    </span>
                  ) : (
                    'Create Listing'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePartSubmit} className="space-y-6">
              {/* Spare part form fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Part Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={partForm.name}
                    onChange={e => setPartForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={partForm.category}
                    onChange={e => setPartForm(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={partForm.price}
                    onChange={e => setPartForm(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compatible Models (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={partForm.compatibility.join(', ')}
                    onChange={e => setPartForm(prev => ({ 
                      ...prev, 
                      compatibility: e.target.value.split(',').map(s => s.trim()) 
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={partForm.description}
                  onChange={e => setPartForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Image upload section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700">
                        <span>Upload image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={uploadingImages}
                          required={!partForm.image}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                {uploadingImages && (
                  <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Uploading image...
                  </div>
                )}

                {partForm.image && (
                  <div className="mt-4">
                    <img
                      src={partForm.image}
                      alt="Part"
                      className="h-48 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || uploadingImages}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Creating Listing...
                    </span>
                  ) : (
                    'Create Listing'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}