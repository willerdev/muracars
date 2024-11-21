import { Link } from 'react-router-dom';
import { Package2, ArrowRight } from 'lucide-react';

export default function ServiceMenu() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/korea-service"
        className="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Package2 className="h-8 w-8 text-black" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Korea Service</h3>
              <p className="text-gray-600">Order products directly from Korea</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-black transition" />
        </div>
      </Link>

      {/* Add other service options here */}
    </div>
  );
}