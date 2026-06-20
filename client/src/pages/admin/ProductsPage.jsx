import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/productApi';
import Loader from '../../components/Loader';
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
          + Add Product
        </Link>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
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
                        <div><span className="font-semibold">${p.discountPrice}</span><span className="text-gray-400 line-through ml-1 text-xs">${p.price}</span></div>
                      ) : <span className="font-semibold">${p.price}</span>}
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

          {pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border text-sm ${p === page ? 'bg-black text-white border-black' : 'border-gray-300'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
