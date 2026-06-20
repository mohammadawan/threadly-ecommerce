import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/authSlice';
import Message from '../../components/Message';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect, { replace: true });
    return () => dispatch(clearError());
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setLocalError('Passwords do not match');
    setLocalError('');
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Create an account</h1>
        <p className="text-gray-500 text-sm mb-6">Join Threadly today</p>

        {(error || localError) && <Message type="error">{localError || error}</Message>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium block mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required placeholder={f.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="font-semibold text-black hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
