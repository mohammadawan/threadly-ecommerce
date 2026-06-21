import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const NAV_LINKS = [
  { label: 'All',         to: '/products' },
  { label: 'Men',         to: '/products?category=men' },
  { label: 'Women',       to: '/products?category=women' },
  { label: 'Kids',        to: '/products?category=kids' },
  { label: 'Accessories', to: '/products?category=accessories' },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);

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

  const isActive = (to) => {
    if (to === '/products') return location.pathname === '/products' && !location.search;
    return location.pathname + location.search === to;
  };

  return (
    <nav className="bg-white border-b border-sage-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.jpg" alt="Threadly" className="h-10 w-10 rounded-full object-cover transition-transform duration-200 group-hover:scale-105" />
            <span className="text-xl font-bold text-sage-800 tracking-tight group-hover:text-sage-600 transition-colors duration-200">Threadly</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 transition-colors duration-200 group
                  ${isActive(link.to) ? 'text-sage-700' : 'text-gray-600 hover:text-sage-700'}`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-sage-500 transition-all duration-250 origin-left
                  ${isActive(link.to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center group">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border border-sage-200 rounded-l-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sage-400 w-40 bg-sage-50 transition-all duration-200 focus:w-52"
            />
            <button type="submit" className="bg-sage-600 text-white px-3 py-1.5 rounded-r-lg text-sm hover:bg-sage-700 active:scale-95 transition-all duration-150">
              ⌕
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-3">

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-sage-50 transition-all duration-200 group">
              <span className="text-xl transition-transform duration-200 group-hover:scale-110 inline-block">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-sage-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200
                    ${dropdownOpen ? 'bg-sage-100 text-sage-800' : 'text-sage-800 hover:bg-sage-50 hover:text-sage-600'}`}
                >
                  <span className="w-7 h-7 rounded-full bg-sage-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {userInfo.name[0].toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{userInfo.name.split(' ')[0]}</span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div className={`absolute right-0 top-full mt-2 w-52 bg-white border border-sage-100 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top-right
                  ${dropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>

                  {/* User info header */}
                  <div className="px-4 py-3 bg-sage-50 border-b border-sage-100">
                    <p className="text-xs font-semibold text-sage-800 truncate">{userInfo.name}</p>
                    <p className="text-xs text-gray-400 truncate">{userInfo.email}</p>
                  </div>

                  <div className="py-1">
                    {userInfo.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-sage-700 font-medium hover:bg-sage-50 transition-colors duration-150"
                      >
                        <svg className="w-4 h-4 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-sage-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      My Orders
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => { setDropdownOpen(false); navigate('/track/' + (userInfo._id || '')); }}
                      className="hidden"
                    />
                  </div>

                  <div className="border-t border-sage-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-sage-600 text-white px-4 py-1.5 rounded-lg hover:bg-sage-700 active:scale-95 transition-all duration-150">
                Login
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-sage-700 hover:bg-sage-50 transition-all duration-150 active:scale-95"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className={`w-5 h-5 transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <div className="border-t border-sage-100 pt-3 flex flex-col gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg font-medium transition-colors duration-150
                  ${isActive(link.to) ? 'bg-sage-100 text-sage-700' : 'text-gray-600 hover:bg-sage-50 hover:text-sage-700'}`}
              >
                {link.label}
              </Link>
            ))}
            <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }} className="flex mt-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="border border-sage-200 rounded-l px-3 py-2 flex-1 text-sm focus:outline-none bg-sage-50 focus:ring-1 focus:ring-sage-400" />
              <button type="submit" className="bg-sage-600 text-white px-4 rounded-r text-sm hover:bg-sage-700 transition-colors">⌕</button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
