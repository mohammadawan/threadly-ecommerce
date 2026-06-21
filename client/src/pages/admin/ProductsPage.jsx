import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/productApi';
import Loader from '../../components/Loader';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    setLoading(true);
    getProducts({ page, limit: 15 })
      .then((res) => { setProducts(res.data.products); setPages(res.data.pages); })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="bg-sage-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sage-800 transition">
          + Add Product
        </Link>
      </div>

      {loading ? <Loader /> : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {products.map((p) => {
              const totalStock = p.sizes?.reduce((a, s) => a + s.stock, 0) || 0;
              return (
                <div key={p._id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={p.images?.[0] || 'https://placehold.co/40x40'} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{p.category} · {p.brand}</p>
                      <p className="text-xs font-bold text-sage-700 mt-0.5">
                        {p.discountPrice ? formatPrice(p.discountPrice) : formatPrice(p.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-xs font-semibold ${totalStock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                        {totalStock} in stock
                      </span>
                      {p.isFeatured && <span className="text-xs">⭐ Featured</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${p._id}/edit`} className="flex-1 text-center text-xs py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Edit</Link>
                    <button onClick={() => handleDelete(p._id)} className="flex-1 text-xs py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium">Delete</button>
                  </div>
                </div>
              );
            })}
            {products.length === 0 && <p className="text-center text-gray-400 py-12">No products yet</p>}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-600">Product</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Category</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Price</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Stock</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Featured</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => {
                    const totalStock = p.sizes?.reduce((a, s) => a + s.stock, 0) || 0;
                    return (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0] || 'https://placehold.co/40x40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 capitalize text-gray-600">{p.category} / {p.subCategory}</td>
                        <td className="p-4">
                          {p.discountPrice ? (
                            <div><span className="font-semibold">{formatPrice(p.discountPrice)}</span><span className="text-gray-400 line-through ml-1 text-xs">{formatPrice(p.price)}</span></div>
                          ) : <span className="font-semibold">{formatPrice(p.price)}</span>}
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${totalStock <= 5 ? 'text-red-500' : 'text-green-600'}`}>{totalStock}</span>
                        </td>
                        <td className="p-4">{p.isFeatured ? '⭐' : '—'}</td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-end">
                            <Link to={`/admin/products/${p._id}/edit`} className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Edit</Link>
                            <button onClick={() => handleDelete(p._id)} className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {products.length === 0 && <p className="text-center text-gray-400 py-10">No products yet</p>}
            </div>
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${p === page ? 'bg-sage-700 text-white border-sage-700' : 'border-gray-300 hover:bg-gray-50'}`}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
