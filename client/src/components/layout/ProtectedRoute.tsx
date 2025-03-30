import { Navigate, Outlet } from "react-router-dom";

import { useUser } from "context/UserContext";

const AdminRoute = () => {
  const { isAdmin, loading, user } = useUser();
  console.log("AdminRoute", { isAdmin, loading, user });

  if (loading) return <></>;
  if (!user) return <Navigate to="/" replace />; // ✅ If not logged in then redirect to login page, `replace` is preventing Backwards Navigation
  return isAdmin ? <Outlet /> : <Navigate to="/results" />; // ✅ Replace is preventing Backwards Navigation
};

export default AdminRoute;
