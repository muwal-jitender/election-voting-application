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

import { UserProvider } from "context/UserContext"; // ✅ Import it
import { useWindowWidth } from "hooks/useWindowWidth";
import React from "react";
import { ToastContainer } from "react-toastify";
import PrivateLayout from "./components/layout/PrivateLayout";
import AdminRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    // ✅ Wrap PrivateLayout in UserProvider here
    element: (
      <UserProvider>
        <PrivateLayout />
      </UserProvider>
    ),
    children: [
      { path: "/results", element: <Results /> },
      { path: "/elections/:id/candidates", element: <Candidates /> },
      {
        element: <AdminRoute />,
        children: [
          { path: "/elections", element: <Elections /> },
          { path: "/elections/:id", element: <ElectionDetails /> },
        ],
      },
      { path: "/congrats", element: <Congrats /> },
      { path: "/logout", element: <Logout /> },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position={useWindowWidth() < 600 ? "bottom-center" : "top-center"}
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
