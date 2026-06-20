import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../api/orderApi';
import { clearCart } from '../../redux/cartSlice';
import { formatPrice } from '../../utils/formatPrice';
import Message from '../../components/Message';
import toast from 'react-hot-toast';

const FIELDS = [
  { name: 'fullName', label: 'Full Name', required: true },
  { name: 'address', label: 'Street Address', required: true },
  { name: 'city', label: 'City', required: true },
  { name: 'state', label: 'State / Province' },
  { name: 'postalCode', label: 'Postal Code', required: true },
  { name: 'phone', label: 'Phone Number', required: true },
];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({
    fullName: userInfo?.name || '', address: '', city: '',
    state: '', postalCode: '', country: 'Pakistan', phone: '',
  });

  const itemsPrice = cartItems.reduce((a, i) => a + i.qty * (i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price), 0);
  const shippingPrice = itemsPrice > 10000 ? 0 : 499;
  const totalPrice = itemsPrice + shippingPrice;

  const handleChange = (e) => setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const orderItems = cartItems.map((i) => ({ product: i._id, size: i.size, color: i.color, qty: i.qty }));
      const { data } = await createOrder({ orderItems, shippingAddress: address, paymentMethod });
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-sage-900">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">

        {/* Left — Address + Payment */}
        <div className="space-y-8">
          {/* Shipping */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-sage-900">Shipping Address</h2>
            <div className="space-y-3">
              {FIELDS.map((f) => (
                <div key={f.name}>
                  <label className="text-sm font-medium block mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    value={address[f.name]}
                    onChange={handleChange}
                    required={f.required}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sage-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-sage-900">Payment Method</h2>
            <div className="space-y-3">

              {/* Cash on Delivery */}
              <label className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition ${paymentMethod === 'cod' ? 'border-sage-500 bg-sage-50' : 'border-gray-200 hover:border-sage-200'}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-sage-600 w-4 h-4"
                />
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                </div>
              </label>

              {/* Stripe Card */}
              <label className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition ${paymentMethod === 'stripe' ? 'border-sage-500 bg-sage-50' : 'border-gray-200 hover:border-sage-200'}`}>
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="accent-sage-600 w-4 h-4"
                />
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-semibold text-sm">Credit / Debit Card</p>
                    <p className="text-xs text-gray-500">Secure payment via Stripe</p>
                  </div>
                </div>
              </label>

            </div>

            {paymentMethod === 'stripe' && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">⚠️ Online card payment requires Stripe setup. Please use Cash on Delivery for now.</p>
              </div>
            )}
          </div>

          {error && <Message type="error">{error}</Message>}
        </div>

        {/* Right — Order Summary */}
        <div>
          <div className="bg-sage-50 border border-sage-100 rounded-xl p-6 sticky top-24 space-y-4">
            <h2 className="text-xl font-bold text-sage-900">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cartItems.map((item) => {
                const p = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
                return (
                  <div key={`${item._id}-${item.size}`} className="flex gap-3">
                    <img src={item.images?.[0] || 'https://placehold.co/56x56'} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-gray-200 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">Size: {item.size} × {item.qty}</p>
                      <p className="font-semibold text-sage-800">{formatPrice(p * item.qty)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-sage-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(itemsPrice)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shippingPrice === 0 ? <span className="text-sage-600 font-medium">FREE</span> : formatPrice(shippingPrice)}</span></div>
              {shippingPrice > 0 && <p className="text-xs text-gray-400">Add {formatPrice(10000 - itemsPrice)} more for free shipping</p>}
              <div className="flex justify-between font-bold text-base border-t border-sage-200 pt-2">
                <span>Total</span>
                <span className="text-sage-800">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 disabled:opacity-50 transition"
            >
              {loading ? 'Placing Order...' : paymentMethod === 'cod' ? '✓ Place Order (COD)' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
