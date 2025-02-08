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
  RootLayout,
} from "./pages/index";

import React from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/results",
        element: <Results />,
      },
      {
        path: "/elections",
        element: <Elections />,
      },
      {
        path: "/elections/:id",
        element: <ElectionDetails />,
      },
      {
        path: "/elections/:id/candidates",
        element: <Candidates />,
      },
      {
        path: "/congrats",
        element: <Congrats />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
]);
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
