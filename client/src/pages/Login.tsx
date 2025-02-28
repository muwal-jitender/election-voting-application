import "./Login.css";

import React from "react";
import { Link } from "react-router-dom";
import { SignInModel } from "../types/index";

const Login = () => {
  const [formData, setRegisterData] = React.useState<SignInModel>({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Submit form data
    console.log("Form submitted", formData);
  };

  return (
    <section className="login">
      <div className="container login__container">
        <h2>Log In</h2>
        <form className="form" onSubmit={handleSubmit}>
          <p className="form__error-message">Any error from the backend</p>

          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            autoComplete="true"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="true"
            value={formData.password}
            onChange={handleChange}
          />

          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
