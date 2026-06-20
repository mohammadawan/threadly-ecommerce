import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createOrder, payOrder } from '../../api/orderApi';
import { clearCart } from '../../redux/cartSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ cartItems, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { userInfo } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({ fullName: userInfo?.name || '', address: '', city: '', state: '', postalCode: '', country: 'US', phone: '' });

  const handleChange = (e) => setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    try {
      const orderItems = cartItems.map((i) => ({
        product: i._id,
        size: i.size,
        color: i.color,
        qty: i.qty,
      }));

      const { data } = await createOrder({ orderItems, shippingAddress: address, paymentMethod: 'stripe' });
      const { order, clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement), billing_details: { name: address.fullName } },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      await payOrder(order._id, {
        id: result.paymentIntent.id,
        status: result.paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
      });

      onSuccess(order._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  const itemsPrice = cartItems.reduce((a, i) => a + i.qty * (i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price), 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 9.99;

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
      {/* Shipping */}
      <div>
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        <div className="space-y-3">
          {[
            { name: 'fullName', label: 'Full Name', required: true },
            { name: 'address', label: 'Street Address', required: true },
            { name: 'city', label: 'City', required: true },
            { name: 'state', label: 'State / Province' },
            { name: 'postalCode', label: 'Postal Code', required: true },
            { name: 'country', label: 'Country', required: true },
            { name: 'phone', label: 'Phone' },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-sm font-medium block mb-1">{f.label}</label>
              <input name={f.name} value={address[f.name]} onChange={handleChange} required={f.required} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Payment</h2>
        <div className="border border-gray-300 rounded-lg px-4 py-3">
          <CardElement options={{ style: { base: { fontSize: '14px' } } }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Test card: 4242 4242 4242 4242 | Any future date | Any CVC</p>
        {error && <Message type="error" >{error}</Message>}
      </div>

      {/* Order summary */}
      <div className="bg-gray-50 rounded-xl p-6 h-fit space-y-4">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cartItems.map((item) => {
            const p = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
            return (
              <div key={`${item._id}-${item.size}`} className="flex gap-3">
                <img src={item.images?.[0]} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-gray-200" />
                <div className="text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Size: {item.size} × {item.qty}</p>
                  <p className="font-semibold">${(p * item.qty).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>${(itemsPrice + shippingPrice).toFixed(2)}</span></div>
        </div>
        <button type="submit" disabled={loading || !stripe} className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((s) => s.cart);

  const handleSuccess = (orderId) => {
    dispatch(clearCart());
    toast.success('Order placed successfully!');
    navigate(`/orders/${orderId}`);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm cartItems={cartItems} onSuccess={handleSuccess} />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
