import React, { useEffect } from "react";

import Image from "../assets/404.gif";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigateBack = useNavigate();

  // Redirect to the previous page after 5 seconds
  useEffect(() => {
    setTimeout(() => {
      navigateBack(-1);
    }, 5000);
  });
  return (
    <section className="errorPage">
      <div className="errorPage__container">
        <img src={Image} alt="404" />
        <h1>404</h1>
        <p>
          The page you are looking for doesn't exist. You will be redirected to
          the previous page shortly.
        </p>
      </div>
    </section>
  );
};

export default ErrorPage;
