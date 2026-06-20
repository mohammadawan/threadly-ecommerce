import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { userInfo } = useSelector((s) => s.auth);
  return userInfo?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
