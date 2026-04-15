import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles, restrictedRoles }) {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated && allowedRoles) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const redirectMap = { admin: '/admin', technician: '/technician', user: '/dashboard' };
    return <Navigate to={redirectMap[user?.role] || '/'} replace />;
  }
  if (restrictedRoles && restrictedRoles.includes(user?.role)) {
    const redirectMap = { admin: '/admin', technician: '/technician', user: '/dashboard' };
    return <Navigate to={redirectMap[user?.role] || '/'} replace />;
  }
  return children;
}
