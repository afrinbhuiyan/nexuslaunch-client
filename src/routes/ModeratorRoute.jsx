import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ModeratorRoute = ({ children }) => {
  const { user, loading, role } = useAuth();

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (user && role === 'moderator') return children;

  return <Navigate to="/dashboard" replace />;
};

export default ModeratorRoute;
