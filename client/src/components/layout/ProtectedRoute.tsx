import { Navigate, Outlet } from "react-router-dom";

import { isAdminUser } from "../../utils/auth.utils";

const AdminRoute = () => {
  return isAdminUser() ? <Outlet /> : <Navigate to="/" replace />; // ✅ Replace is preventing Backwards Navigation
};

export default AdminRoute;
