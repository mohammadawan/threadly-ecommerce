import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orderApi';
import { formatPrice } from '../../utils/formatPrice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const STEPS = [
  { key: 'pending',    label: 'Order Placed',  icon: '🛍️',  desc: 'We received your order' },
  { key: 'processing', label: 'Processing',    icon: '⚙️',  desc: 'Packing your items' },
  { key: 'shipped',    label: 'Shipped',        icon: '🚚',  desc: 'On the way to you' },
  { key: 'delivered',  label: 'Delivered',      icon: '✅',  desc: 'Order completed' },
];

const STATUS_COLORS = {
  pending:    'text-yellow-600 bg-yellow-50 border-yellow-200',
  processing: 'text-blue-600 bg-blue-50 border-blue-200',
  shipped:    'text-purple-600 bg-purple-50 border-purple-200',
  delivered:  'text-green-600 bg-green-50 border-green-200',
  cancelled:  'text-red-600 bg-red-50 border-red-200',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="max-w-3xl mx-auto px-4 py-10"><Message type="error">{error}</Message></div>;

  const stepIndex = STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/orders" className="text-sm text-sage-600 hover:underline mb-2 block">← My Orders</Link>
          <h1 className="text-2xl font-bold text-sage-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <span className={`text-sm font-semibold px-4 py-1.5 rounded-full border capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {order.status}
        </span>
      </div>

      {/* Tracking Timeline */}
      {!isCancelled && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-sage-900 mb-6 flex items-center gap-2">
            <span>📍</span> Order Tracking
          </h2>

          {/* Step bar */}
          <div className="relative flex items-start justify-between mb-8">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-sage-500 z-0 transition-all duration-700"
              style={{ width: stepIndex >= 0 ? `${(stepIndex / (STEPS.length - 1)) * 100}%` : '0%' }}
            />

            {STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
                    done ? 'bg-sage-600 border-sage-600 shadow-md shadow-sage-200' : 'bg-white border-gray-300'
                  } ${active ? 'ring-4 ring-sage-100' : ''}`}>
                    {done ? <span className="text-white text-base">{step.icon}</span> : <span className="text-gray-300 text-base">{step.icon}</span>}
                  </div>
                  <p className={`text-xs font-semibold mt-2 text-center ${done ? 'text-sage-700' : 'text-gray-400'}`}>{step.label}</p>
                  <p className={`text-xs mt-0.5 text-center hidden sm:block ${done ? 'text-gray-500' : 'text-gray-300'}`}>{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Status History Timeline */}
          {order.statusHistory?.length > 0 && (
            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">History</p>
              <div className="space-y-3">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${i === 0 ? 'bg-sage-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 capitalize">{h.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(h.timestamp).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}
                        {new Date(h.timestamp).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${STATUS_COLORS[h.status] || 'bg-gray-100 text-gray-600'}`}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold text-red-700">Order Cancelled</p>
            <p className="text-sm text-red-500">This order has been cancelled.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Items */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-sage-900 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex gap-3">
                <img src={item.image || 'https://placehold.co/60x60'} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-sage-900">{item.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Size: {item.size} {item.color && `· ${item.color}`} · Qty: {item.qty}</p>
                  <p className="font-semibold text-sage-700 mt-1">{formatPrice(item.price * item.qty)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Shipping */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-sage-900 mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && <p className="mt-1">📞 {order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-sage-900 mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Card'}</span>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shippingPrice === 0 ? <span className="text-sage-600 font-medium">FREE</span> : formatPrice(order.shippingPrice)}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-sage-800">{formatPrice(order.totalPrice)}</span>
              </div>
              <p className={`text-xs font-semibold pt-1 ${order.isPaid ? 'text-green-600' : order.paymentMethod === 'cod' ? 'text-amber-500' : 'text-red-500'}`}>
                {order.isPaid
                  ? `✓ Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                  : order.paymentMethod === 'cod' ? '⏳ Pay on delivery' : 'Not Paid'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
