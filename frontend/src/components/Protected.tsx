import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC<{ isAuthenticated: boolean }> = ({
  isAuthenticated,
}) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
