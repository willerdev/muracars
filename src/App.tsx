import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Filters from './components/Filters';
import VehicleGrid from './components/VehicleGrid';
import Footer from './components/Footer';
import Cart from './components/Cart';
import VehicleDetail from './pages/VehicleDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { fetchCars } from './lib/database';
import { FilterState, Vehicle } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Profile from './pages/Profile';
import OrderPage from './pages/OrderPage';
import TradeIn from './pages/TradeIn';
import SparePartsPage from './pages/SparePartsPage';
import MobileNavTabs from './components/MobileNavTabs';
import NewCars from './pages/NewCars';
import UsedCars from './pages/UsedCars';
import Sell from './pages/Sell';
import MyListings from './pages/MyListings';
import Settings from './pages/settings';
import Offline from './pages/Offline';
import Cars from './pages/cars';
import KoreaService from './pages/KoreaOrderService';
import AddCar from './pages/AddCar';
interface PrivateRouteProps {
  element: React.ReactElement;
}

function PrivateRoute({ element }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with the return URL
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return element;
}

function App() {
  const [filters, setFilters] = useState<FilterState>({
    condition: '',
    minPrice: 0,
    maxPrice: 0,
    make: '',
    transmission: '',
    fuelType: ''
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await fetchCars();
        setVehicles(data);
      } catch (err) {
        setError('Failed to load vehicles');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <Offline />;
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filters.condition && vehicle.features !== filters.condition) return false;
    if (filters.minPrice && vehicle.price < filters.minPrice) return false;
    if (filters.maxPrice && vehicle.price > filters.maxPrice) return false;
    if (filters.make && vehicle.make !== filters.make) return false;
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
    if (filters.fuelType && vehicle.fuel_type !== filters.fuelType) return false;
    return true;
  });

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/vehicle/:id" element={<VehicleDetail />} />
              <Route 
                path="/order/:id" 
                element={<PrivateRoute element={<OrderPage />} />} 
              />
              <Route path="/add-car" element={<PrivateRoute element={<AddCar />} />} />
              <Route 
                path="/cars/:id" 
                element={<PrivateRoute element={<Cars />} />} 
              />
              <Route 
                path="/trade-in/:id" 
                element={<PrivateRoute element={<TradeIn />} />} 
              />
               <Route 
                path="/new-cars" 
                element={<PrivateRoute element={<NewCars />} />} 
              />
              <Route 
                path="/settings" 
                element={<PrivateRoute element={<Settings />} />} 
              />
              <Route 
                path="/profile" 
                element={<PrivateRoute element={<Profile />} />} 
              />
              <Route path="/" element={
                <>
                  <Hero />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/4">
                        <Filters filters={filters} setFilters={setFilters} />
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold">Available Vehicles</h2>
                          <span className="text-gray-600">{filteredVehicles.length} results</span>
                        </div>
                        <VehicleGrid vehicles={filteredVehicles} isLoading={isLoading} />
                      </div>
                    </div>
                  </main>
                </>
              } />
              <Route path="/spare-parts" element={<PrivateRoute element={<SparePartsPage />} />} />
              <Route path="/sell" element={<PrivateRoute element={<Sell />} />} />
              <Route path="/new-cars" element={<NewCars />} />
              <Route path="/used-cars" element={<UsedCars />} />
              <Route path="/my-listings" element={<PrivateRoute element={<MyListings />} />} />
              <Route path="/korea-service" element={<PrivateRoute element={<KoreaService />} />} />
            </Routes>
            
            <Footer className="hidden md:block" />
            <MobileNavTabs />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;