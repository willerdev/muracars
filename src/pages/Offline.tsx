import { Car, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Offline() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Car className="h-10 w-10 text-black" />
          <span className="ml-2 text-2xl font-bold text-black">MURA</span>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
          <WifiOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600 mb-6">
            Please check your internet connection and try again.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Retry Connection
            </button>
            
            <Link 
              to="/"
              className="block w-full text-center text-gray-600 hover:text-black transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}