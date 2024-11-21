import { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';
import { uploadFile, uploadFiles } from '../lib/storage';

interface ListVehicleFormProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function ListVehicleForm({ onClose, onSuccess, userId }: ListVehicleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: '',
    color: '',
    image_url: '',
    features: '',
    images: '',
    flag: 'used' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(e.target.files)) {
        const publicUrl = await uploadFile(file, 'vehicle-listings');
        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setVehicleForm(prev => ({
          ...prev,
          image_url: uploadedUrls[0],
          images: uploadedUrls.join(',')
        }));
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const vehicleData = {
        make: vehicleForm.make,
        model: vehicleForm.model,
        year: vehicleForm.year,
        price: vehicleForm.price,
        mileage: vehicleForm.mileage,
        transmission: vehicleForm.transmission,
        fuel_type: vehicleForm.fuel_type,
        body_type: vehicleForm.body_type,
        color: vehicleForm.color,
        image_url: vehicleForm.image_url,
        features: vehicleForm.features,
        images: vehicleForm.images,
        flag: vehicleForm.flag,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: carData, error: carError } = await supabase
        .from('cars')
        .insert(vehicleData)
        .select()
        .single();

      if (carError) throw carError;

      // Link the car to the user
      const { error: userCarError } = await supabase
        .from('user_cars')
        .insert({
          user_id: userId,
          car_id: carData.id,
          is_owner: true
        });

      if (userCarError) throw userCarError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-2xl font-bold mb-6">List Your Car here</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={vehicleForm.fuel_type}
                  onChange={e => setVehicleForm(prev => ({ ...prev, fuel_type: e.target.value as Vehicle['fuel_type'] }))}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body Type
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={vehicleForm.body_type}
                  onChange={e => setVehicleForm(prev => ({ ...prev, body_type: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={vehicleForm.color}
                  onChange={e => setVehicleForm(prev => ({ ...prev, color: e.target.value }))}
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
                value={vehicleForm.features}
                onChange={e => setVehicleForm(prev => ({ ...prev, features: e.target.value }))}
              />
            </div>

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

              {(vehicleForm.image_url || vehicleForm.images.split(',').length > 0) && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {vehicleForm.image_url && (
                    <img
                      src={vehicleForm.image_url}
                      alt="Main vehicle image"
                      className="h-24 w-full object-cover rounded-lg"
                    />
                  )}
                  {vehicleForm.image_url && (
                  <div className="mt-4">
                    <img
                      src={vehicleForm.image_url}
                      alt="Main vehicle image"
                      className="h-48 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
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
        </div>
      </div>
    </div>
  );
}