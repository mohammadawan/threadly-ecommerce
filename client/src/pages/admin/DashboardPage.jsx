import { useEffect, useState } from 'react';
import { getAnalytics } from '../../api/orderApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Loader from '../../components/Loader';
import { formatPrice } from '../../utils/formatPrice';

const MetricCard = ({ label, value, sub }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={formatPrice(data?.totalRevenue || 0)} sub="All time" />
        <MetricCard label="Total Orders" value={data?.totalOrders || 0} sub="All time" />
        <MetricCard label="Products" value={data?.totalProducts || 0} sub="Active" />
        <MetricCard label="Customers" value={data?.totalCustomers || 0} sub="Registered" />
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-4">Revenue — Last {days} Days</h2>
        {data?.revenueData?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No revenue data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data?.revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [formatPrice(v), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Best sellers */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-4">Best Selling Products</h2>
        <div className="space-y-3">
          {data?.bestSellers?.length === 0 ? (
            <p className="text-gray-400 text-sm">No sales yet</p>
          ) : data?.bestSellers?.map((p, i) => (
            <div key={p._id} className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
              <img src={p.images?.[0] || 'https://placehold.co/48x48'} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-gray-400">{p.soldCount} sold</p>
              </div>
              <p className="font-semibold">{formatPrice(p.price)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
