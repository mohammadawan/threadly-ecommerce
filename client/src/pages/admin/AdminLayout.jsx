import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';

const links = [
  {
    to: '/admin', label: 'Dashboard', end: true,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  },
  {
    to: '/admin/products', label: 'Products',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  },
  {
    to: '/admin/orders', label: 'Orders',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  },
  {
    to: '/admin/users', label: 'Users',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

const Sidebar = ({ open, onClose, userInfo, onLogout, onBack }) => (
  <>
    {/* Overlay */}
    <div
      className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />

    {/* Drawer */}
    <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-sage-900 text-sage-200 flex flex-col shrink-0 shadow-xl z-40 transition-transform duration-300 ease-in-out
      ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

      {/* Logo + close on mobile */}
      <div className="p-5 border-b border-sage-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Threadly" className="w-10 h-10 rounded-xl object-cover ring-2 ring-sage-600" />
          <div>
            <p className="text-white font-bold text-lg leading-tight">Threadly</p>
            <p className="text-xs text-sage-400 font-medium">Admin Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-sage-400 hover:text-white p-1 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs text-sage-500 uppercase tracking-widest font-semibold px-3 mb-3">Main Menu</p>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive ? 'bg-sage-600 text-white shadow-md shadow-sage-900/30' : 'text-sage-300 hover:bg-sage-800 hover:text-white'
              }`
            }
          >
            {l.icon}
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sage-800 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{userInfo?.name}</p>
            <p className="text-sage-400 text-xs truncate">{userInfo?.email}</p>
          </div>
        </div>
        <button onClick={onBack} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sage-300 hover:bg-sage-800 hover:text-white transition-all group">
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Store
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-all group">
          <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  </>
);

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((s) => s.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => setSidebarOpen(false), [location.pathname]);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const pageTitle = links.find((l) => l.end ? location.pathname === l.to : location.pathname.startsWith(l.to))?.label || 'Admin';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userInfo={userInfo}
        onLogout={handleLogout}
        onBack={() => navigate('/')}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-sage-700 hover:bg-sage-50 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title on mobile */}
          <p className="text-sm font-semibold text-sage-800 md:hidden">{pageTitle}</p>

          {/* Welcome on desktop */}
          <p className="hidden md:block text-sm text-gray-500">
            Welcome back, <span className="font-semibold text-sage-800">{userInfo?.name}</span> 👋
          </p>

          <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
            <span className="hidden sm:inline">Store is live</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
