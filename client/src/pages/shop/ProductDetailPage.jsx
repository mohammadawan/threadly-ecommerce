import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, getProductReviews, createReview } from '../../api/productApi';
import { addToCart } from '../../redux/cartSlice';
import Rating from '../../components/Rating';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import toast from 'react-hot-toast';

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
      toast.success('Review submitted!');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square mb-3">
            <img src={product.images?.[activeImage] || 'https://placehold.co/600x600?text=No+Image'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImage === i ? 'border-black' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide">{product.brand}</p>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          </div>
          <Rating value={product.ratings} numReviews={product.numReviews} size="lg" />
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">${price.toFixed(2)}</span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-gray-400 line-through text-xl">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Color */}
          {product.colors?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Color: <span className="font-normal capitalize">{selectedColor}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={`px-3 py-1 border rounded-full text-sm capitalize ${selectedColor === c ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div>
            <p className="text-sm font-semibold mb-2">Size:</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes?.map(({ size, stock }) => (
                <button key={size} onClick={() => setSelectedSize(size)} disabled={stock === 0} className={`w-12 h-12 border rounded-lg text-sm font-medium ${selectedSize === size ? 'bg-black text-white border-black' : stock === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through' : 'border-gray-300 hover:border-black'}`}>{size}</button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">Qty:</p>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100">−</button>
              <span className="px-4 py-2 border-x border-gray-300">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-gray-100">+</button>
            </div>
          </div>

          <button onClick={handleAddToCart} className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Review list */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : reviews.map((r) => (
              <div key={r._id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{r.user?.name}</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <Rating value={r.rating} />
                <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Write review */}
          <div>
            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
            {!userInfo ? (
              <Message type="info">Please login to write a review</Message>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && <Message type="error">{reviewError}</Message>}
                <div>
                  <label className="text-sm font-medium block mb-1">Rating</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none">
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Comment</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none resize-none" placeholder="Share your experience..." />
                </div>
                <button type="submit" disabled={reviewLoading} className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
