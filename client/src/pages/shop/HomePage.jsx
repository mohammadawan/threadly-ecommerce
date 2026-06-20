import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../../api/productApi';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';

const categories = [
  { label: 'Men', value: 'men', emoji: '👔' },
  { label: 'Women', value: 'women', emoji: '👗' },
  { label: 'Kids', value: 'kids', emoji: '🧒' },
  { label: 'Accessories', value: 'accessories', emoji: '👜' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then((res) => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Dress Your Best
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8">
            Premium clothing for every style and every occasion
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="group bg-gray-100 rounded-2xl p-8 text-center hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <p className="font-semibold">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium underline hover:text-gray-600">
            View All
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : featured.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-black text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-3">Free Shipping on Orders Over $100</h2>
          <p className="text-gray-400 mb-6">Shop more, save more. No code needed.</p>
          <Link to="/products" className="inline-block border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
