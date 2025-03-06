import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default RootLayout;
