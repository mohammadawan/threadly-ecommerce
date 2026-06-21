import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orderApi';
import { formatPrice } from '../../utils/formatPrice';
import Loader from '../../components/Loader';

const JOURNEY = [
  { status: 'pending',    icon: '🛍️', title: 'Order Placed',        location: 'Threadly Warehouse',     desc: 'Your order has been received and confirmed' },
  { status: 'processing', icon: '📦', title: 'Order Packed',         location: 'Sorting Facility',        desc: 'Your items are packed and ready to ship' },
  { status: 'shipped',    icon: '🚚', title: 'Out for Delivery',     location: 'In Transit',              desc: 'Your order is on the way to your city' },
  { status: 'delivered',  icon: '✅', title: 'Delivered',            location: 'Your Address',            desc: 'Package delivered successfully' },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

const TrackOrderPage = () => {
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

  if (error) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">📦</p>
      <h2 className="text-xl font-bold text-gray-700 mb-2">Order not found</h2>
      <p className="text-gray-400 mb-6">Please check your order ID and try again.</p>
      <Link to="/orders" className="bg-sage-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-sage-700">My Orders</Link>
    </div>
  );

  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const city = order.shippingAddress?.city || 'Your City';
  const estimatedSteps = JOURNEY.map((step, i) => ({
    ...step,
    location: step.status === 'shipped' ? `En route to ${city}` : step.status === 'delivered' ? city : step.location,
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <Link to="/orders" className="text-sm text-sage-600 hover:underline flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Orders
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-sage-900">Track Order</h1>
            <p className="text-gray-500 text-sm mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sage-800 text-lg">{formatPrice(order.totalPrice)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Card'}</p>
          </div>
        </div>
      </div>

      {/* Cancelled banner */}
      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold text-red-700">Order Cancelled</p>
            <p className="text-sm text-red-400">This order was cancelled and will not be delivered.</p>
          </div>
        </div>
      )}

      {/* Main tracking card */}
      {!isCancelled && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">

          {/* Status banner */}
          <div className={`px-6 py-4 flex items-center gap-3 ${
            order.status === 'delivered' ? 'bg-green-600' :
            order.status === 'shipped'   ? 'bg-purple-600' :
            order.status === 'processing'? 'bg-blue-600' : 'bg-sage-600'
          } text-white`}>
            <span className="text-2xl">{estimatedSteps[currentIndex]?.icon}</span>
            <div>
              <p className="font-bold text-lg">{estimatedSteps[currentIndex]?.title}</p>
              <p className="text-sm opacity-80">{estimatedSteps[currentIndex]?.desc}</p>
            </div>
          </div>

          {/* Journey steps */}
          <div className="p-6">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
              {/* Filled line */}
              <div
                className="absolute left-5 top-5 w-0.5 bg-sage-500 transition-all duration-700"
                style={{ height: currentIndex > 0 ? `${(currentIndex / (JOURNEY.length - 1)) * 100}%` : '0%' }}
              />

              <div className="space-y-0">
                {estimatedSteps.map((step, i) => {
                  const done = i <= currentIndex;
                  const active = i === currentIndex;
                  const historyEntry = order.statusHistory?.find((h) => h.status === step.status);

                  return (
                    <div key={step.status} className="relative flex items-start gap-4 pb-8 last:pb-0">
                      {/* Circle */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        done
                          ? 'bg-sage-600 border-sage-600 shadow-md shadow-sage-200'
                          : 'bg-white border-gray-200'
                      } ${active ? 'ring-4 ring-sage-100 scale-110' : ''}`}>
                        <span className={`text-lg ${!done ? 'opacity-30' : ''}`}>{step.icon}</span>
                        {active && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-sage-400 rounded-full animate-ping" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`font-semibold text-sm ${done ? 'text-sage-900' : 'text-gray-300'}`}>{step.title}</p>
                            <p className={`text-xs mt-0.5 flex items-center gap-1 ${done ? 'text-gray-500' : 'text-gray-300'}`}>
                              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {step.location}
                            </p>
                          </div>
                          {historyEntry && (
                            <p className="text-xs text-gray-400 shrink-0">
                              {new Date(historyEntry.timestamp).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                              {' '}
                              {new Date(historyEntry.timestamp).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                        {active && (
                          <p className="text-xs text-sage-600 font-medium mt-1.5 bg-sage-50 border border-sage-100 px-2 py-1 rounded-lg inline-block">
                            📍 Current Status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery address + items */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Delivery info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sage-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Delivery Address
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
            <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            {order.shippingAddress.phone && <p className="pt-1">📞 {order.shippingAddress.phone}</p>}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sage-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Items ({order.orderItems.length})
          </h3>
          <div className="space-y-2">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <img src={item.image || 'https://placehold.co/40x40'} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">Size: {item.size} · Qty: {item.qty}</p>
                </div>
                <p className="text-xs font-semibold text-sage-700 shrink-0">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between text-sm font-bold">
            <span>Total</span>
            <span className="text-sage-800">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
