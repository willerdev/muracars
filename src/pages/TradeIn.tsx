import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, Loader } from 'lucide-react';

interface TradeInForm {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimated_value: number;
  location: string;
  registered_owner: string;
  contact_number: string;
  preferred_visit_time: string;
  description: string;
  images: string[];
}

export default function TradeIn() {
  const { id: car_id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [form, setForm] = useState<TradeInForm>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: 'Used',
    estimated_value: 0,
    location: '',
    registered_owner: '',
    contact_number: '',
    preferred_visit_time: '',
    description: '',
    images: [],
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(e.target.files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `trade-in-images/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('vehicles')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('vehicles')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
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
      const { error } = await supabase
        .from('trade_ins')
        .insert({
          ...form,
          car_id,
          user_id: user?.id,
          status: 'pending',
        });

      if (error) throw error;
      
      navigate('/profile', { 
        state: { message: 'Trade-in request submitted successfully!' }
      });
    } catch (err) {
      console.error('Error submitting trade-in:', err);
      setError('Failed to submit trade-in request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Trade-In Your Vehicle</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
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
                  className="w-full border border-gray-300 rounded-lg p-2"
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
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={form.year}
                  onChange={e => setForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
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
                  className="w-full border border-gray-300 rounded-lg p-2"
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
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={form.condition}
                  onChange={e => setForm(prev => ({ ...prev, condition: e.target.value }))}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Value
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={form.estimated_value}
                  onChange={e => setForm(prev => ({ ...prev, estimated_value: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={form.location}
                  onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registered Owner
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={form.registered_owner}
                  onChange={e => setForm(prev => ({ ...prev, registered_owner: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={form.contact_number}
                  onChange={e => setForm(prev => ({ ...prev, contact_number: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Visit Time
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekdays after 5PM"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={form.preferred_visit_time}
                  onChange={e => setForm(prev => ({ ...prev, preferred_visit_time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2"
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
              {form.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {form.images.map((url, index) => (
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
                    Submitting...
                  </span>
                ) : (
                  'Submit Trade-In Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}