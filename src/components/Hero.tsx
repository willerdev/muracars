import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative h-[400px] w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-3xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Your Perfect Drive
          </h1>
          <p className="text-lg text-gray-200 mb-6">
            Premium vehicles and authentic parts, all in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/vehicles" className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
              Browse Vehicles
            </Link>
            <Link to="/spare-parts" className="border-2 border-white text-white px-6 py-2 rounded-md font-semibold hover:bg-white/10 transition">
              Shop Parts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}