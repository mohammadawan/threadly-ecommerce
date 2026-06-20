import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/productApi';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['men', 'women', 'kids', 'accessories'];
const SORTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const size = searchParams.get('size') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    getProducts({ keyword, category, size, sort, minPrice, maxPrice, page, limit: 12 })
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
        setTotal(res.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword, category, size, sort, minPrice, maxPrice, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <h3 className="font-bold text-lg mb-4">Filters</h3>

          {/* Category */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Category</p>
            <div className="space-y-1">
              <button onClick={() => setParam('category', '')} className={`block text-sm w-full text-left px-2 py-1 rounded ${!category ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setParam('category', c)} className={`block text-sm w-full text-left px-2 py-1 rounded capitalize ${category === c ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>{c}</button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} onClick={() => setParam('size', size === s ? '' : s)} className={`px-2 py-1 border text-xs rounded ${size === s ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Price</p>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setParam('minPrice', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none" />
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setParam('maxPrice', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none" />
            </div>
          </div>

          {/* Clear */}
          <button onClick={() => { setSearchParams({}); setPage(1); }} className="text-sm text-red-500 hover:underline">
            Clear All Filters
          </button>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{total} products</p>
            <select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
