
export default function Footer() {
  return (
    <footer className="hidden md:block bg-black text-white">
      {/* Desktop Footer */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">About Mura</h3>
              <p className="text-gray-400">
                Premium vehicles and authentic parts, delivering excellence in automotive retail since 1970.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Linkss</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Vehicles</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Spare Parts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Kigali rwanda</li>
                <li>Whatsapp +250 788 681 805</li>
                <li>Tell +250 788 681 805</li>
                <li>info@muracars.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden px-4 py-8">
        <div className="flex flex-wrap gap-4">
          <div className="w-[calc(50%-8px)]">
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Vehicles</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Spare Parts</a></li>
            </ul>
          </div>
          <div className="w-[calc(50%-8px)]">
            <h3 className="text-lg font-bold mb-2">Services</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Maintenance</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white">Repairs</a></li>
            </ul>
          </div>
          <div className="w-[calc(50%-8px)]">
            <h3 className="text-lg font-bold mb-2">Contact</h3>
            <ul className="space-y-1">
              <li className="text-sm text-gray-400">+250 788 681 805</li>
              <li className="text-sm text-gray-400">info@muracars.com</li>
            </ul>
          </div>
          <div className="w-[calc(50%-8px)]">
            <h3 className="text-lg font-bold mb-2">About</h3>
            <p className="text-sm text-gray-400">Premium vehicles and authentic parts since 2016.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}