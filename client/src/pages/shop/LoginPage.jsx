import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/authSlice';
import Message from '../../components/Message';

const EyeIcon = ({ open }) => open ? (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const DEMO_ACCOUNTS = [
  {
    label: 'Admin',
    email: 'admin@threadly.com',
    password: 'admin123',
    color: 'purple',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: 'User',
    email: 'user@threadly.com',
    password: 'user123',
    color: 'sage',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect, { replace: true });
    return () => dispatch(clearError());
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  const fillDemo = (account) => {
    setForm({ email: account.email, password: account.password });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4">

        {/* Demo access cards */}
        <div className="grid grid-cols-2 gap-3">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.label}
              type="button"
              onClick={() => fillDemo(acc)}
              className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 group
                ${acc.color === 'purple'
                  ? 'border-purple-200 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
                  : 'border-sage-200 bg-sage-50 hover:border-sage-400 hover:bg-sage-100'
                }`}
            >
              <div className={`flex items-center gap-2 mb-1.5 font-semibold text-sm
                ${acc.color === 'purple' ? 'text-purple-700' : 'text-sage-700'}`}>
                <span className={acc.color === 'purple' ? 'text-purple-500' : 'text-sage-500'}>
                  {acc.icon}
                </span>
                {acc.label} Access
              </div>
              <p className="text-xs text-gray-500 truncate">{acc.email}</p>
              <p className="text-xs text-gray-400">{acc.password}</p>
              <p className={`text-xs font-medium mt-1.5 transition-colors
                ${acc.color === 'purple' ? 'text-purple-400 group-hover:text-purple-600' : 'text-sage-400 group-hover:text-sage-600'}`}>
                Click to fill →
              </p>
            </button>
          ))}
        </div>

        {/* Login card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <img src="/logo.jpg" alt="Threadly" className="w-14 h-14 rounded-2xl object-cover mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-sage-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Login to your Threadly account</p>
          </div>

          {error && <Message type="error">{error}</Message>}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sage-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-sage-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sage-600 transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 disabled:opacity-50 transition">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="font-semibold text-sage-700 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
