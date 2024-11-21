import { Car, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-black text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Car className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">MURA</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-300">Vehicles</Link>
            <Link to="/spare-parts" className="hover:text-gray-300">Spare Parts</Link>
            <Link to="/korea-service" className="hover:text-gray-300">Korea orders</Link>
            <Search className="h-5 w-5 cursor-pointer hover:text-gray-300" />
            <ShoppingCart 
              className="h-5 w-5 cursor-pointer hover:text-gray-300"
              onClick={onCartClick}
            />
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                <button
                  onClick={logout}
                  className="hover:text-gray-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-gray-300">
                Sign in
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 hover:bg-gray-900">Vehicles</Link>
            <Link to="/spare-parts" className="block px-3 py-2 hover:bg-gray-900">Spare Parts</Link>
            <Link to="/korea-service" className="block px-3 py-2 hover:bg-gray-900">Korea Service</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block px-3 py-2 hover:bg-gray-900">Profile</Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 hover:bg-gray-900">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}