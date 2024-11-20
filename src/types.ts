export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  condition: 'New' | 'Used';
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  description?: string;
  features?: string[];
}

export interface SparePart {
  id: string;
  name: string;
  category: string;
  price: number;
  compatibility: string[];
  image: string;
}

export interface FilterState {
  condition: string;
  minPrice: number;
  maxPrice: number;
  make: string;
  transmission: string;
  fuelType: string;
}

export interface CartItem {
  id: string;
  type: 'vehicle' | 'part';
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}