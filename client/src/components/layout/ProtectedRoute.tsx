import { Navigate, Outlet } from "react-router-dom";

import { useUser } from "context/UserContext";

const AdminRoute = () => {
  const { isAdmin, loading } = useUser();
  if (loading) return <div>...</div>;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />; // ✅ Replace is preventing Backwards Navigation
};

export default AdminRoute;
