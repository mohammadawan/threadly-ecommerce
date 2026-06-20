import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Threadly</h3>
          <p className="text-sm text-gray-400">Modern clothing for every occasion.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products?category=men" className="hover:text-white">Men</Link></li>
            <li><Link to="/products?category=women" className="hover:text-white">Women</Link></li>
            <li><Link to="/products?category=kids" className="hover:text-white">Kids</Link></li>
            <li><Link to="/products?category=accessories" className="hover:text-white">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Info</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="text-gray-400">Free shipping over $100</span></li>
            <li><span className="text-gray-400">30-day returns</span></li>
            <li><span className="text-gray-400">Secure payments</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Threadly. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
