import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Candidates,
  Congrats,
  ElectionDetails,
  Elections,
  ErrorPage,
  Login,
  Logout,
  Register,
  Results,
} from "./pages/general/index";

import React from "react";
import PrivateLayout from "./components/layout/PrivateLayout";
import AdminRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />, // ✅ Public Layout for non-authenticated users
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <PrivateLayout />, // ✅ Private Layout for authenticated users
    children: [
      { path: "/results", element: <Results /> },
      {
        element: <AdminRoute />, // ✅ Protect admin routes
        children: [
          { path: "/elections", element: <Elections /> },
          { path: "/elections/:id", element: <ElectionDetails /> },
          { path: "/elections/:id/candidates", element: <Candidates /> },
        ],
      },
      { path: "/congrats", element: <Congrats /> },
      { path: "/logout", element: <Logout /> },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
