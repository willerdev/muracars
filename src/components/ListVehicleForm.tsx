import { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';

interface ListVehicleFormProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function ListVehicleForm({ onClose, onSuccess, userId }: ListVehicleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(e.target.files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `vehicle-listings/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('vehicles')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('vehicles')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setForm(prev => ({
          ...prev,
          image_url: uploadedUrls[0],
          gallery_images: uploadedUrls.slice(1)
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
      // Insert the car listing
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .insert({
          ...form,
          created_at: new Date().toISOString()
        })
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

          <h2 className="text-2xl font-bold mb-6">List Your Vehicle</h2>

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
                  value={form.make}
                  onChange={e => setForm(prev => ({ ...prev, make: e.target.value }))}
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
                  value={form.model}
                  onChange={e => setForm(prev => ({ ...prev, model: e.target.value }))}
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
                  value={form.year}
                  onChange={e => setForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
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
                  value={form.price}
                  onChange={e => setForm(prev => ({ ...prev, price: parseInt(e.target.value) }))}
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
                  value={form.mileage}
                  onChange={e => setForm(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={form.condition}
                  onChange={e => setForm(prev => ({ ...prev, condition: e.target.value as Vehicle['condition'] }))}
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
                  value={form.transmission}
                  onChange={e => setForm(prev => ({ ...prev, transmission: e.target.value as Vehicle['transmission'] }))}
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
                  value={form.fuelType}
                  onChange={e => setForm(prev => ({ ...prev, fuelType: e.target.value as Vehicle['fuelType'] }))}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
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
                        required={!form.image_url}
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

              {(form.image_url || form.gallery_images.length > 0) && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt="Main vehicle image"
                      className="h-24 w-full object-cover rounded-lg"
                    />
                  )}
                  {form.gallery_images.map((url, index) => (
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
        </div>
      </div>
    </div>
  );
}