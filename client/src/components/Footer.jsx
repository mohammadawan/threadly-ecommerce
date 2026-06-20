import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-sage-900 text-sage-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.jpg" alt="Threadly" className="w-8 h-8 rounded-full object-cover" />
            <h3 className="text-white font-bold text-lg">Threadly</h3>
          </div>
          <p className="text-sm text-sage-400">Modern clothing for every occasion.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products?category=men" className="hover:text-white transition-colors">Men</Link></li>
            <li><Link to="/products?category=women" className="hover:text-white transition-colors">Women</Link></li>
            <li><Link to="/products?category=kids" className="hover:text-white transition-colors">Kids</Link></li>
            <li><Link to="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Info</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="text-sage-400">Free shipping over Rs. 10,000</span></li>
            <li><span className="text-sage-400">30-day returns</span></li>
            <li><span className="text-sage-400">Secure payments</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sage-800 mt-8 pt-6 text-center text-sm text-sage-500">
        © {new Date().getFullYear()} Threadly. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
