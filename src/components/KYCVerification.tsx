import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, Loader, Shield, CheckCircle } from 'lucide-react';
import { uploadFile, uploadFiles } from '../lib/storage';

interface KYCVerificationProps {
  onSuccess?: () => void;
}

export default function KYCVerification({ onSuccess }: KYCVerificationProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    id_type: '',
    id_number: '',
    id_expiry_date: '',
    id_document_url: '',
    proof_of_address_url: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone_number: ''
  });

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'address') => {
    if (!e.target.files || !e.target.files.length) return;
    
    setUploadingDocuments(true);
    
    try {
      const file = e.target.files[0];
      const publicUrl = await uploadFile(file, `kyc-documents/${user?.id}/${type}`);
      
      setForm(prev => ({
        ...prev,
        [type === 'id' ? 'id_document_url' : 'proof_of_address_url']: publicUrl
      }));
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
    } finally {
      setUploadingDocuments(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('kyc_verifications')
        .insert({
          user_id: user?.id,
          ...form,
          verification_status: 'pending'
        });

      if (error) throw error;
      
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error submitting KYC:', err);
      setError('Failed to submit KYC verification');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verification Submitted</h2>
        <p className="text-gray-600">
          Your KYC verification has been submitted successfully. We'll review your documents and update you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-black mr-3" />
        <div>
          <h2 className="text-2xl font-bold">Identity Verification</h2>
          <p className="text-gray-600">Complete your KYC verification to unlock all features</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Type
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.id_type}
              onChange={e => setForm(prev => ({ ...prev, id_type: e.target.value }))}
            >
              <option value="">Select ID Type</option>
              <option value="passport">Passport</option>
              <option value="driving_license">Driving License</option>
              <option value="national_id">National ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Number
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.id_number}
              onChange={e => setForm(prev => ({ ...prev, id_number: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Expiry Date
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.id_expiry_date}
              onChange={e => setForm(prev => ({ ...prev, id_expiry_date: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.phone_number}
              onChange={e => setForm(prev => ({ ...prev, phone_number: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.address_line1}
              onChange={e => setForm(prev => ({ ...prev, address_line1: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={form.address_line2}
              onChange={e => setForm(prev => ({ ...prev, address_line2: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.city}
                onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.state}
                onChange={e => setForm(prev => ({ ...prev, state: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.postal_code}
                onChange={e => setForm(prev => ({ ...prev, postal_code: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.country}
                onChange={e => setForm(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Document
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700">
                    <span>Upload ID document</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      onChange={e => handleDocumentUpload(e, 'id')}
                      disabled={uploadingDocuments}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proof of Address
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700">
                    <span>Upload proof of address</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      onChange={e => handleDocumentUpload(e, 'address')}
                      disabled={uploadingDocuments}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || uploadingDocuments}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Submitting...
              </span>
            ) : (
              'Submit Verification'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}