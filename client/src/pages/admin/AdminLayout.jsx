import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/products', label: '👕 Products' },
  { to: '/admin/orders', label: '📦 Orders' },
  { to: '/admin/users', label: '👥 Users' },
];

const AdminLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <aside className="w-56 bg-gray-900 text-gray-300 flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-800">
        <p className="text-white font-bold text-lg">Threadly</p>
        <p className="text-xs text-gray-500">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${isActive ? 'bg-white text-gray-900 font-semibold' : 'hover:bg-gray-800 hover:text-white'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="flex-1 overflow-auto">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
