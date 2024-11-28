import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadFiles } from '../lib/storage';

export default function AddCar() {
  const [carForm, setCarForm] = useState({
    name: '',
    year: new Date().getFullYear(),
    price: 0,
    location: '',
    brand: '',
    images: [] as string[],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;

    setUploadingImages(true);
    try {
      const files = Array.from(e.target.files);
      const uploadedUrls = await uploadFiles(files, 'car-images');
      setCarForm(prev => ({ ...prev, images: uploadedUrls }));
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('cars_supplier')
        .insert({
          name: carForm.name,
          year: carForm.year,
          price: carForm.price,
          location: carForm.location,
          brand: carForm.brand,
          images: carForm.images.join(','),
        });

      if (error) throw error;
      alert('Car added successfully!');
    } catch (err) {
      console.error('Error adding car:', err);
      setError('Failed to add car');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Add New Car</h2>
        <input type="text" placeholder="Car Name" required className="w-full border border-gray-300 rounded-md p-2" onChange={e => setCarForm({ ...carForm, name: e.target.value })} />
        <input type="number" placeholder="Year" required min="1900" max={new Date().getFullYear()} className="w-full border border-gray-300 rounded-md p-2" onChange={e => setCarForm({ ...carForm, year: parseInt(e.target.value) })} />
        <input type="number" placeholder="Price" required className="w-full border border-gray-300 rounded-md p-2" onChange={e => setCarForm({ ...carForm, price: parseInt(e.target.value) })} />
        <input type="text" placeholder="Location" required className="w-full border border-gray-300 rounded-md p-2" onChange={e => setCarForm({ ...carForm, location: e.target.value })} />
        <input type="text" placeholder="Brand" required className="w-full border border-gray-300 rounded-md p-2" onChange={e => setCarForm({ ...carForm, brand: e.target.value })} />
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploadingImages} className="w-full border border-gray-300 rounded-md p-2" />
        <button type="submit" disabled={uploadingImages} className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">Add Car</button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
} 