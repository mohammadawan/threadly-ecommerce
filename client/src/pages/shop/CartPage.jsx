import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQty } from '../../redux/cartSlice';
import { formatPrice } from '../../utils/formatPrice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((s) => s.cart);
  const { userInfo } = useSelector((s) => s.auth);

  const itemsPrice = cartItems.reduce((a, i) => a + i.qty * (i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price), 0);
  const shippingPrice = itemsPrice > 10000 ? 0 : 499;
  const total = itemsPrice + shippingPrice;

  const handleCheckout = () => {
    if (!userInfo) navigate('/login?redirect=/checkout');
    else navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-4xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Start shopping to add items here.</p>
        <Link to="/products" className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemPrice = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
            const key = `${item._id}-${item.size}-${item.color}`;
            return (
              <div key={key} className="flex gap-4 bg-white rounded-xl p-4 border border-gray-200">
                <img src={item.images?.[0] || 'https://placehold.co/100x100'} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                <div className="flex-1">
                  <Link to={`/products/${item._id}`} className="font-semibold hover:underline">{item.name}</Link>
                  <p className="text-sm text-gray-500">Size: {item.size} {item.color && `| Color: ${item.color}`}</p>
                  <p className="font-bold mt-1">{formatPrice(itemPrice)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => dispatch(removeFromCart({ id: item._id, size: item.size, color: item.color }))} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => dispatch(updateQty({ id: item._id, size: item.size, color: item.color, qty: Math.max(1, item.qty - 1) }))} className="px-2 py-1 hover:bg-gray-100 text-sm">−</button>
                    <span className="px-3 py-1 border-x border-gray-300 text-sm">{item.qty}</span>
                    <button onClick={() => dispatch(updateQty({ id: item._id, size: item.size, color: item.color, qty: item.qty + 1 }))} className="px-2 py-1 hover:bg-gray-100 text-sm">+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit space-y-4">
          <h2 className="text-lg font-bold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(itemsPrice)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}</span></div>
            {shippingPrice > 0 && <p className="text-xs text-gray-400">Add {formatPrice(10000 - itemsPrice)} more for free shipping</p>}
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <button onClick={handleCheckout} className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
            Proceed to Checkout
          </button>
          <Link to="/products" className="block text-center text-sm text-gray-500 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
