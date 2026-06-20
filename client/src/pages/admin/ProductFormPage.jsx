import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../api/productApi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const CATEGORIES = ['men', 'women', 'kids', 'accessories'];

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '', category: 'men',
    subCategory: '', brand: '', isFeatured: false,
    sizes: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }, { size: 'XL', stock: 0 }],
    colors: '',
  });

  useEffect(() => {
    if (!isEdit) return;
    getProductById(id)
      .then((res) => {
        const p = res.data;
        setForm({ ...p, colors: p.colors?.join(', ') || '', discountPrice: p.discountPrice || '', sizes: p.sizes || [] });
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...form.sizes];
    updated[index] = { ...updated[index], [field]: field === 'stock' ? Number(value) : value };
    setForm((prev) => ({ ...prev, sizes: updated }));
  };

  const addSize = () => setForm((prev) => ({ ...prev, sizes: [...prev.sizes, { size: '', stock: 0 }] }));
  const removeSize = (i) => setForm((prev) => ({ ...prev, sizes: prev.sizes.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'sizes') formData.append(k, JSON.stringify(v));
        else if (k === 'colors') formData.append(k, JSON.stringify(v.split(',').map((c) => c.trim()).filter(Boolean)));
        else formData.append(k, v);
      });
      images.forEach((img) => formData.append('images', img));

      if (isEdit) await updateProduct(id, formData);
      else await createProduct(formData);

      toast.success(isEdit ? 'Product updated' : 'Product created');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8"><Loader /></div>;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-1">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Price *</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Discount Price</label>
            <input name="discountPrice" type="number" step="0.01" value={form.discountPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Sub-Category *</label>
            <input name="subCategory" value={form.subCategory} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="e.g. shirts, jeans, dresses" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div className="flex items-center gap-2 self-end pb-2">
            <input type="checkbox" name="isFeatured" id="featured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4" />
            <label htmlFor="featured" className="text-sm font-medium">Featured Product</label>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-1">Colors (comma separated)</label>
            <input name="colors" value={form.colors} onChange={handleChange} placeholder="black, white, red" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Sizes & Stock</label>
            <button type="button" onClick={addSize} className="text-xs text-blue-600 hover:underline">+ Add Size</button>
          </div>
          <div className="space-y-2">
            {form.sizes.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={s.size} onChange={(e) => handleSizeChange(i, 'size', e.target.value)} placeholder="Size" className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                <input type="number" value={s.stock} onChange={(e) => handleSizeChange(i, 'stock', e.target.value)} placeholder="Stock" className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                <button type="button" onClick={() => removeSize(i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="text-sm font-medium block mb-1">Images {!isEdit && '(up to 5)'}</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files))} className="text-sm" />
          {images.length > 0 && <p className="text-xs text-gray-400 mt-1">{images.length} file(s) selected</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50">
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
