import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAdminRoute = false }) {
  const { currentUser, loading, initialFetchDone} = useSelector((state) => state.user);
  
  if (!initialFetchDone) {
    return null;
  }
  
  if (!currentUser && loading === false) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && !currentUser.role === 'admin') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;