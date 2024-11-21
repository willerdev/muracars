import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export default function Filters({ filters, setFilters }: FiltersProps) {
  return (
    <div className="hidden md:block bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            className="w-full border rounded-md p-2"
            value={filters.condition}
            onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 border rounded-md p-2"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 border rounded-md p-2"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <select
            className="w-full border rounded-md p-2"
            value={filters.make}
            onChange={(e) => setFilters({ ...filters, make: e.target.value })}
          >
            <option value="">All Makes</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes">Mercedes</option>
            <option value="Audi">Audi</option>
            <option value="Tesla">Tesla</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmission
          </label>
          <select
            className="w-full border rounded-md p-2"
            value={filters.transmission}
            onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
          >
            <option value="">All</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type
          </label>
          <select
            className="w-full border rounded-md p-2"
            value={filters.fuelType}
            onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          >
            <option value="">All</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>
    </div>
  );
}