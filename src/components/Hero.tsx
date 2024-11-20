export default function Hero() {
  return (
    <div className="relative h-[90vh] w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Discover Your Perfect Drive
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Premium vehicles and authentic parts, all in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
              Browse Vehicles
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition">
              Shop Parts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}