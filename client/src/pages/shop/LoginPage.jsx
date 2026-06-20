import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/authSlice';
import Message from '../../components/Message';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect, { replace: true });
    return () => dispatch(clearError());
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Login to your Threadly account</p>

        {error && <Message type="error">{error}</Message>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="font-semibold text-black hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
