import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../../api/orderApi';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS = { pending: 'text-yellow-600', processing: 'text-blue-600', shipped: 'text-purple-600', delivered: 'text-green-600', cancelled: 'text-red-600' };

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

  const stepIndex = STEPS.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`font-bold capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
      </div>

      {/* Status tracker */}
      {order.status !== 'cancelled' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${i <= stepIndex ? 'bg-black border-black text-white' : 'border-gray-300 text-gray-400'}`}>{i + 1}</div>
                <div className="flex-1 mx-1">
                  <p className={`text-xs capitalize text-center ${i <= stepIndex ? 'text-black font-semibold' : 'text-gray-400'}`}>{step}</p>
                  {i < STEPS.length - 1 && <div className={`h-0.5 mt-1 ${i < stepIndex ? 'bg-black' : 'bg-gray-200'}`} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex gap-3">
                <img src={item.image || 'https://placehold.co/60x60'} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Size: {item.size} {item.color && `| ${item.color}`} × {item.qty}</p>
                  <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
              <p className={`text-xs font-semibold ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>{order.isPaid ? `✓ Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
