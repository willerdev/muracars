export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image_url: string;
  gallery_images?: string[];
  condition: 'New' | 'Used';
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  features?: string[];
  description?: string;
  flag: 'import' | 'used';
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

export interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserCar {
  id: string;
  user_id: string;
  car_id: string;
  is_owner: boolean;
  created_at: string;
  cars: Vehicle;
}

export interface UserCarWithDetails {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
  is_owner: boolean;
  cars: Vehicle;
}