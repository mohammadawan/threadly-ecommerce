import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import { formatPrice } from '../../utils/formatPrice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-sage-900">My Orders</h1>
      {error && <Message type="error">{error}</Message>}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="bg-sage-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-sage-700">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sage-200 transition">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">
                    {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Card'}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
                <div className="text-right">
                  <p className="font-bold text-sage-800">{formatPrice(order.totalPrice)}</p>
                  <p className="text-xs text-gray-400">{order.orderItems.length} item(s)</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {order.orderItems.slice(0, 4).map((item, i) => (
                  <img key={i} src={item.image || 'https://placehold.co/60x60'} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0" />
                ))}
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <Link
                  to={`/track/${order._id}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-sage-700 bg-sage-50 border border-sage-200 px-4 py-2 rounded-lg hover:bg-sage-100 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  Track Order
                </Link>
                <Link
                  to={`/orders/${order._id}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
