import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, getProductReviews, createReview } from '../../api/productApi';
import { addToCart } from '../../redux/cartSlice';
import Rating from '../../components/Rating';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const StarButton = ({ value, selected, onClick }) => (
  <button type="button" onClick={() => onClick(value)} className="text-3xl transition-transform hover:scale-110 focus:outline-none">
    <span className={value <= selected ? 'text-amber-400' : 'text-gray-300'}>★</span>
  </button>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    Promise.all([getProductById(id), getProductReviews(id)])
      .then(([pRes, rRes]) => {
        setProduct(pRes.data);
        setReviews(rRes.data);
        if (pRes.data.colors?.[0]) setSelectedColor(pRes.data.colors[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <Message type="error">Product not found</Message>;

  const selectedSizeData = product.sizes?.find((s) => s.size === selectedSize);
  const inStock = selectedSizeData ? selectedSizeData.stock > 0 : false;
  const price = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error('Please select a size');
    if (!inStock) return toast.error('Out of stock');
    dispatch(addToCart({ ...product, _id: product._id, size: selectedSize, color: selectedColor, qty }));
    toast.success('Added to cart!');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await createReview(id, { rating, comment });
      setReviews((prev) => [res.data, ...prev]);
      setComment('');
      setRating(5);
      toast.success('Review submitted!');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square mb-3 shadow-sm">
            <img src={product.images?.[activeImage] || 'https://placehold.co/600x600?text=No+Image'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${activeImage === i ? 'border-sage-500' : 'border-transparent hover:border-sage-300'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-xs text-sage-500 uppercase tracking-widest font-semibold mb-1">{product.brand}</p>
            <h1 className="text-3xl font-bold text-sage-900 leading-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Rating value={product.ratings} numReviews={product.numReviews} size="lg" />
            {product.numReviews > 0 && <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-sage-800">{formatPrice(price)}</span>
            {product.discountPrice && product.discountPrice < product.price && (
              <>
                <span className="text-gray-400 line-through text-xl">{formatPrice(product.price)}</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Color */}
          {product.colors?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Color: <span className="font-normal text-gray-600 capitalize">{selectedColor}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-1.5 border rounded-full text-sm capitalize transition ${selectedColor === c ? 'border-sage-600 bg-sage-600 text-white' : 'border-gray-300 hover:border-sage-400'}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div>
            <p className="text-sm font-semibold mb-2">Size:</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes?.map(({ size, stock }) => (
                <button key={size} onClick={() => setSelectedSize(size)} disabled={stock === 0}
                  className={`w-12 h-12 border-2 rounded-xl text-sm font-semibold transition ${selectedSize === size ? 'bg-sage-600 text-white border-sage-600' : stock === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through' : 'border-gray-300 hover:border-sage-400 hover:text-sage-700'}`}>
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && !inStock && <p className="text-red-500 text-xs mt-1">Out of stock in this size</p>}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">Quantity:</p>
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-gray-100 font-bold text-lg">−</button>
              <span className="px-4 py-2 border-x-2 border-gray-200 font-semibold min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-2 hover:bg-gray-100 font-bold text-lg">+</button>
            </div>
          </div>

          <button onClick={handleAddToCart} className="w-full bg-sage-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-sage-700 transition shadow-md shadow-sage-200 active:scale-[0.99]">
            Add to Cart
          </button>

          <div className="flex gap-4 text-xs text-gray-400 pt-1">
            <span>✓ Free shipping over Rs. 10,000</span>
            <span>✓ 30-day returns</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-sage-900">Customer Reviews</h2>
          {avgRating && (
            <div className="flex items-center gap-2 bg-sage-50 border border-sage-200 rounded-full px-4 py-1">
              <span className="text-amber-400 text-lg">★</span>
              <span className="font-bold text-sage-800">{avgRating}</span>
              <span className="text-gray-400 text-sm">/ 5 ({reviews.length})</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Review list */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-sage-50 rounded-2xl border border-sage-100">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-gray-500 font-medium">No reviews yet</p>
                <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
              </div>
            ) : reviews.map((r) => (
              <div key={r._id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sage-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {r.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-sage-900">{r.user?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`text-lg ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Write review */}
          <div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg text-sage-900 mb-1">Write a Review</h3>
              <p className="text-xs text-gray-400 mb-5">Only available after your order is delivered</p>

              {!userInfo ? (
                <div className="text-center py-8 bg-sage-50 rounded-xl">
                  <p className="text-2xl mb-2">🔐</p>
                  <p className="text-gray-600 font-medium">Login to write a review</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  {reviewError && <Message type="error">{reviewError}</Message>}

                  {/* Star rating */}
                  <div>
                    <label className="text-sm font-semibold block mb-2">Your Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((v) => (
                        <StarButton key={v} value={v} selected={rating} onClick={setRating} />
                      ))}
                      <span className="ml-2 text-sm text-gray-500 self-center">{['','Poor','Fair','Good','Very Good','Excellent'][rating]}</span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="text-sm font-semibold block mb-2">Your Review</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      required
                      className="border border-gray-300 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-300 resize-none"
                      placeholder="Share your experience with this product..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 disabled:opacity-50 transition"
                  >
                    {reviewLoading ? 'Submitting...' : '✓ Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
