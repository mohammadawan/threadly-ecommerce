import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../api/wishlistApi';
import Rating from './Rating';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);

  const price = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = product.sizes?.find((s) => s.stock > 0)?.size;
    if (!defaultSize) return toast.error('Out of stock');
    dispatch(addToCart({ ...product, size: defaultSize, qty: 1 }));
    toast.success('Added to cart');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error('Login to save items');
    try {
      await addToWishlist(product._id);
      toast.success('Added to wishlist');
    } catch {
      toast.error('Already in wishlist');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPrice && product.discountPrice < product.price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ♡
        </button>
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-black text-white text-sm py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
        <Rating value={product.ratings} numReviews={product.numReviews} />
        <div className="flex items-center gap-2">
          <span className="font-semibold">${price.toFixed(2)}</span>
          {product.discountPrice && product.discountPrice < product.price && (
            <span className="text-gray-400 line-through text-sm">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
