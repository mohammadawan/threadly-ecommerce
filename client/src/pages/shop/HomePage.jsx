import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../../api/productApi';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';

const categories = [
  { label: 'Men', value: 'men', icon: '👔' },
  { label: 'Women', value: 'women', icon: '👗' },
  { label: 'Kids', value: 'kids', icon: '🧒' },
  { label: 'Accessories', value: 'accessories', icon: '👜' },
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
    <div className="bg-[#f8f7f4]">

      {/* Hero */}
      <section className="relative bg-sage-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-sage-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-sage-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-sage-300 text-sm uppercase tracking-widest mb-3 font-medium">New Collection 2026</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5 leading-tight">
              Dress<br />Your Best
            </h1>
            <p className="text-sage-200 text-lg mb-8 max-w-md">
              Premium clothing crafted for every style and every occasion.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Link
                to="/products"
                className="inline-block bg-white text-sage-800 font-semibold px-8 py-3 rounded-full hover:bg-sage-50 transition"
              >
                Shop Now
              </Link>
              <Link
                to="/products?category=women"
                className="inline-block border border-sage-400 text-white px-8 py-3 rounded-full hover:bg-sage-700 transition"
              >
                Women's Edit
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="Threadly"
              className="w-56 h-56 md:w-72 md:h-72 rounded-3xl object-cover shadow-2xl opacity-90"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-2 text-sage-900">Shop by Category</h2>
        <p className="text-gray-500 text-sm mb-8">Find exactly what you're looking for</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="group bg-white border border-sage-100 rounded-2xl p-8 text-center hover:bg-sage-600 hover:text-white hover:border-sage-600 transition-all duration-200 shadow-sm"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <p className="font-semibold text-gray-800 group-hover:text-white">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-sage-900">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Hand-picked for you</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-sage-600 hover:text-sage-800 underline underline-offset-2">
            View All →
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
      <section className="bg-sage-700 text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-sage-300 text-xs uppercase tracking-widest mb-2">Limited Time</p>
          <h2 className="text-3xl font-bold mb-3">Free Shipping Over Rs. 10,000</h2>
          <p className="text-sage-200 mb-6">Shop more, save more. No code needed.</p>
          <Link to="/products" className="inline-block border border-white px-8 py-3 rounded-full hover:bg-white hover:text-sage-800 transition font-medium">
            Explore Collection
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
