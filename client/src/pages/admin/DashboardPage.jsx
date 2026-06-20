import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../../api/orderApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatPrice } from '../../utils/formatPrice';
import Loader from '../../components/Loader';

const MetricCard = ({ label, value, sub, color = 'sage' }) => {
  const colors = {
    sage: 'bg-sage-50 border-sage-200 text-sage-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-sm opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
};

const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

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
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sage-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your store performance</p>
        </div>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={formatPrice(data?.totalRevenue || 0)} sub="All confirmed orders" color="sage" />
        <MetricCard label="Total Orders" value={data?.totalOrders || 0} sub="Excluding cancelled" color="blue" />
        <MetricCard label="Products" value={data?.totalProducts || 0} sub="Active listings" color="purple" />
        <MetricCard label="Customers" value={data?.totalCustomers || 0} sub="Registered users" color="amber" />
      </div>

      {/* Pending COD banner */}
      {data?.pendingCOD?.count > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800">💵 Pending Cash on Delivery</p>
            <p className="text-sm text-amber-600">{data.pendingCOD.count} order(s) awaiting payment on delivery</p>
          </div>
          <p className="text-2xl font-bold text-amber-800">{formatPrice(data.pendingCOD.amount)}</p>
        </div>
      )}

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-sage-900 mb-1">Revenue — Last {days} Days</h2>
        <p className="text-xs text-gray-400 mb-4">Based on all confirmed orders placed</p>
        {!data?.revenueData?.length ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-gray-400 text-sm">No orders yet in this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#557643" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#557643" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatPrice(v), 'Revenue']} labelFormatter={(l) => `Date: ${l}`} />
              <Area type="monotone" dataKey="revenue" stroke="#557643" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Orders bar chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-sage-900 mb-4">Orders per Day</h2>
          {!data?.revenueData?.length ? (
            <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip formatter={(v) => [v, 'Orders']} />
                <Bar dataKey="orders" fill="#8aae72" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Best sellers */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-sage-900 mb-4">Best Selling Products</h2>
          <div className="space-y-3">
            {!data?.bestSellers?.length ? (
              <p className="text-gray-400 text-sm text-center py-8">No sales yet</p>
            ) : data.bestSellers.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
                <img src={p.images?.[0] || 'https://placehold.co/48x48'} alt={p.name} className="w-11 h-11 rounded-lg object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.soldCount} sold</p>
                </div>
                <p className="font-semibold text-sage-800 text-sm shrink-0">{formatPrice(p.discountPrice || p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sage-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-sage-600 hover:underline">View all →</Link>
        </div>
        {!data?.recentOrders?.length ? (
          <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {data.recentOrders.map((order) => (
              <Link key={order._id} to={`/admin/orders/${order._id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-sage-50 transition">
                <div>
                  <p className="text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs">{order.paymentMethod === 'cod' ? '💵 COD' : '💳 Card'}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-sm text-sage-800">{formatPrice(order.totalPrice)}</span>
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
