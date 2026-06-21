import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchMe, logout } from './redux/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import HomePage from './pages/shop/HomePage';
import ProductListPage from './pages/shop/ProductListPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderHistoryPage from './pages/shop/OrderHistoryPage';
import OrderDetailPage from './pages/shop/OrderDetailPage';
import LoginPage from './pages/shop/LoginPage';
import RegisterPage from './pages/shop/RegisterPage';

import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import OrdersPage from './pages/admin/OrdersPage';
import UsersPage from './pages/admin/UsersPage';

const ShopLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const AppInner = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);

  // On every app load, refresh user data from server to get latest role
  useEffect(() => {
    if (userInfo?.token) {
      dispatch(fetchMe()).unwrap().catch(() => {
        // Token expired or invalid — log out
        dispatch(logout());
      });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ShopLayout><HomePage /></ShopLayout>} />
      <Route path="/products" element={<ShopLayout><ProductListPage /></ShopLayout>} />
      <Route path="/products/:id" element={<ShopLayout><ProductDetailPage /></ShopLayout>} />
      <Route path="/cart" element={<ShopLayout><CartPage /></ShopLayout>} />
      <Route path="/login" element={<ShopLayout><LoginPage /></ShopLayout>} />
      <Route path="/register" element={<ShopLayout><RegisterPage /></ShopLayout>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<ShopLayout><CheckoutPage /></ShopLayout>} />
        <Route path="/orders" element={<ShopLayout><OrderHistoryPage /></ShopLayout>} />
        <Route path="/orders/:id" element={<ShopLayout><OrderDetailPage /></ShopLayout>} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    <AppInner />
  </BrowserRouter>
);

export default App;
