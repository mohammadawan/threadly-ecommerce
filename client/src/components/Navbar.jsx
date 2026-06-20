import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${search.trim()}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight">Threadly</Link>

          {/* Nav links - desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/products" className="hover:text-black">All</Link>
            <Link to="/products?category=men" className="hover:text-black">Men</Link>
            <Link to="/products?category=women" className="hover:text-black">Women</Link>
            <Link to="/products?category=kids" className="hover:text-black">Kids</Link>
            <Link to="/products?category=accessories" className="hover:text-black">Accessories</Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border border-gray-300 rounded-l-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-black w-40"
            />
            <button type="submit" className="bg-black text-white px-3 py-1.5 rounded-r-lg text-sm hover:bg-gray-800">
              ⌕
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-sm font-medium hover:text-gray-600"
                >
                  {userInfo.name.split(' ')[0]} ▾
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {userInfo.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50"
                    >
                      My Orders
                    </Link>
                    <hr className="border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800">
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 flex flex-col gap-3 text-sm">
            <Link to="/products" onClick={() => setMenuOpen(false)}>All</Link>
            <Link to="/products?category=men" onClick={() => setMenuOpen(false)}>Men</Link>
            <Link to="/products?category=women" onClick={() => setMenuOpen(false)}>Women</Link>
            <Link to="/products?category=kids" onClick={() => setMenuOpen(false)}>Kids</Link>
            <form onSubmit={handleSearch} className="flex">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="border rounded-l px-2 py-1 flex-1 text-sm focus:outline-none" />
              <button type="submit" className="bg-black text-white px-3 rounded-r text-sm">⌕</button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
