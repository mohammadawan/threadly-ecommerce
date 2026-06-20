import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    getAllOrders({ status: statusFilter, page, limit: 15 })
      .then((res) => { setOrders(res.data.orders); setPages(res.data.pages); setTotal(res.data.total); })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter, page]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Status updated');
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders <span className="text-gray-400 font-normal text-lg">({total})</span></h1>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
          {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Order ID</th>
                <th className="text-left p-4 font-semibold text-gray-600">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                <th className="text-left p-4 font-semibold text-gray-600">Total</th>
                <th className="text-left p-4 font-semibold text-gray-600">Paid</th>
                <th className="text-left p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Link to={`/admin/orders/${order._id}`} className="font-mono text-xs text-blue-600 hover:underline">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                      {order.isPaid ? '✓ Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border text-sm ${p === page ? 'bg-black text-white border-black' : 'border-gray-300'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
