import { Vehicle } from '../types';

export const vehicles: Vehicle[] = [
  {
    id: '1',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2024,
    price: 85900,
    mileage: 0,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80',
    condition: 'New',
    transmission: 'Automatic',
    fuelType: 'Petrol'
  },
  {
    id: '2',
    make: 'Mercedes',
    model: 'EQS',
    year: 2024,
    price: 104900,
    mileage: 1200,
    image: 'https://images.unsplash.com/photo-1622199732676-a69702e7e3b8?auto=format&fit=crop&q=80',
    condition: 'Used',
    transmission: 'Automatic',
    fuelType: 'Electric'
  },
  {
    id: '3',
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    price: 147900,
    mileage: 0,
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80',
    condition: 'New',
    transmission: 'Automatic',
    fuelType: 'Electric'
  },
  {
    id: '4',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    price: 108990,
    mileage: 0,
    image: 'https://images.unsplash.com/photo-1617886903355-42b8f825d8ba?auto=format&fit=crop&q=80',
    condition: 'New',
    transmission: 'Automatic',
    fuelType: 'Electric'
  }
];