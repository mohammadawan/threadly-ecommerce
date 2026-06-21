import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../../api/orderApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatPrice } from '../../utils/formatPrice';
import Loader from '../../components/Loader';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const METRIC_STYLES = {
  sage:   { wrap: 'bg-sage-50 border-sage-200',   text: 'text-sage-800',   icon: 'text-sage-400',   iconBg: 'bg-sage-100' },
  blue:   { wrap: 'bg-blue-50 border-blue-200',   text: 'text-blue-800',   icon: 'text-blue-400',   iconBg: 'bg-blue-100' },
  purple: { wrap: 'bg-purple-50 border-purple-200', text: 'text-purple-800', icon: 'text-purple-400', iconBg: 'bg-purple-100' },
  amber:  { wrap: 'bg-amber-50 border-amber-200',  text: 'text-amber-800',  icon: 'text-amber-400',  iconBg: 'bg-amber-100' },
};

const MetricCard = ({ label, value, sub, color = 'sage', icon }) => {
  const s = METRIC_STYLES[color];
  return (
    <div className={`rounded-xl border p-3 sm:p-5 ${s.wrap}`}>
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p className={`text-xs opacity-70 mb-1 ${s.text}`}>{label}</p>
          <p className={`text-base sm:text-2xl lg:text-3xl font-bold leading-tight break-words ${s.text}`}>{value}</p>
          {sub && <p className={`text-xs opacity-60 mt-1 ${s.text}`}>{sub}</p>}
        </div>
        {icon && (
          <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 hidden sm:block ${s.iconBg}`}>
            <span className={s.icon}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    getAnalytics(days)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) return <div className="p-8"><Loader /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-sage-900">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500">Overview of your store performance</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          label="Total Revenue" value={formatPrice(data?.totalRevenue || 0)} sub="All confirmed orders" color="sage"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MetricCard
          label="Total Orders" value={data?.totalOrders || 0} sub="Excluding cancelled" color="blue"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <MetricCard
          label="Products" value={data?.totalProducts || 0} sub="Active listings" color="purple"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <MetricCard
          label="Customers" value={data?.totalCustomers || 0} sub="Registered users" color="amber"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
      </div>

      {/* Pending COD banner */}
      {data?.pendingCOD?.count > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="font-semibold text-amber-800">💵 Pending Cash on Delivery</p>
            <p className="text-sm text-amber-600">{data.pendingCOD.count} order(s) awaiting payment on delivery</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-800 shrink-0">{formatPrice(data.pendingCOD.amount)}</p>
        </div>
      )}

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <h2 className="font-bold text-sage-900 mb-0.5 text-sm sm:text-base">Revenue — Last {days} Days</h2>
        <p className="text-xs text-gray-400 mb-4">Based on all confirmed orders placed</p>
        {!data?.revenueData?.length ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-gray-400 text-sm">No orders yet in this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#557643" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#557643" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={36} />
              <Tooltip formatter={(v) => [formatPrice(v), 'Revenue']} labelFormatter={(l) => `Date: ${l}`} />
              <Area type="monotone" dataKey="revenue" stroke="#557643" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Orders chart + Best sellers */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h2 className="font-bold text-sage-900 mb-4 text-sm sm:text-base">Orders per Day</h2>
          {!data?.revenueData?.length ? (
            <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} allowDecimals={false} width={24} />
                <Tooltip formatter={(v) => [v, 'Orders']} />
                <Bar dataKey="orders" fill="#8aae72" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h2 className="font-bold text-sage-900 mb-4 text-sm sm:text-base">Best Selling Products</h2>
          <div className="space-y-3">
            {!data?.bestSellers?.length ? (
              <p className="text-gray-400 text-sm text-center py-8">No sales yet</p>
            ) : data.bestSellers.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-base font-bold text-gray-300 w-5 shrink-0">#{i + 1}</span>
                <img src={p.images?.[0] || 'https://placehold.co/48x48'} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.soldCount} sold</p>
                </div>
                <p className="font-semibold text-sage-800 text-xs sm:text-sm shrink-0">{formatPrice(p.discountPrice || p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sage-900 text-sm sm:text-base">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs sm:text-sm text-sage-600 hover:underline">View all →</Link>
        </div>
        {!data?.recentOrders?.length ? (
          <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {data.recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`/admin/orders`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-sage-50 transition gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 truncate">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <span className="text-xs hidden sm:inline">{order.paymentMethod === 'cod' ? '💵 COD' : '💳 Card'}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-sage-800 whitespace-nowrap">{formatPrice(order.totalPrice)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
