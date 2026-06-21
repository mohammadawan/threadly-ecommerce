import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';
import { formatPrice } from '../../utils/formatPrice';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

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
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-bold">
          Orders <span className="text-gray-400 font-normal text-base">({total})</span>
        </h1>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-bold text-sage-700">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm font-semibold mt-0.5">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sage-800">{formatPrice(order.totalPrice)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.paymentMethod === 'cod' ? '💵 COD' : '💳 Card'}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${order.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                      {order.isPaid ? '✓ Paid' : order.paymentMethod === 'cod' ? 'On Delivery' : 'Unpaid'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white"
                  >
                    {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center text-gray-400 py-12">No orders yet</p>}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-600">Order ID</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Customer</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Total</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Payment</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono text-xs text-sage-600">#{order._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{order.user?.name}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </td>
                      <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold text-sage-800">{formatPrice(order.totalPrice)}</td>
                      <td className="p-4">
                        <span className="text-xs">{order.paymentMethod === 'cod' ? '💵 COD' : '💳 Card'}</span>
                        <p className={`text-xs font-semibold ${order.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                          {order.isPaid ? '✓ Paid' : order.paymentMethod === 'cod' ? 'On Delivery' : 'Unpaid'}
                        </p>
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
              {orders.length === 0 && <p className="text-center text-gray-400 py-10">No orders yet</p>}
            </div>
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${p === page ? 'bg-sage-600 text-white border-sage-600' : 'border-gray-300 hover:bg-gray-50'}`}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
