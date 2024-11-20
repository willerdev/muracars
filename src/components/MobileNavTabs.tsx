import { Car, Settings, List, Tag, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileNavTabs() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <div className="grid grid-cols-5 gap-1">
        <Link
          to="/new-cars"
          className={`flex flex-col items-center py-2 ${
            location.pathname === '/new-cars' ? 'text-black' : 'text-gray-500'
          }`}
        >
          <Car className="h-5 w-5" />
          <span className="text-xs mt-1">New Cars</span>
        </Link>
        
        <Link
          to="/used-cars"
          className={`flex flex-col items-center py-2 ${
            location.pathname === '/used-cars' ? 'text-black' : 'text-gray-500'
          }`}
        >
          <Tag className="h-5 w-5" />
          <span className="text-xs mt-1">Used Cars</span>
        </Link>

        <Link
          to="/sell"
          className={`flex flex-col items-center py-2 ${
            location.pathname === '/sell' ? 'text-black' : 'text-gray-500'
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs mt-1">Sell</span>
        </Link>

        <Link
          to="/my-listings"
          className={`flex flex-col items-center py-2 ${
            location.pathname === '/my-listings' ? 'text-black' : 'text-gray-500'
          }`}
        >
          <List className="h-5 w-5" />
          <span className="text-xs mt-1">My Listings</span>
        </Link>

        <Link
          to="/settings"
          className={`flex flex-col items-center py-2 ${
            location.pathname === '/settings' ? 'text-black' : 'text-gray-500'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
}