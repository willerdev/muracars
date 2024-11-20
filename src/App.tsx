import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Filters from './components/Filters';
import VehicleGrid from './components/VehicleGrid';
import Footer from './components/Footer';
import Cart from './components/Cart';
import VehicleDetail from './pages/VehicleDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { vehicles } from './data/vehicles';
import { FilterState } from './types';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

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

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filters.condition && vehicle.condition !== filters.condition) return false;
    if (filters.minPrice && vehicle.price < filters.minPrice) return false;
    if (filters.maxPrice && vehicle.price > filters.maxPrice) return false;
    if (filters.make && vehicle.make !== filters.make) return false;
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) return false;
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
                        <VehicleGrid vehicles={filteredVehicles} />
                      </div>
                    </div>
                  </main>
                </>
              } />
            </Routes>
            
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;