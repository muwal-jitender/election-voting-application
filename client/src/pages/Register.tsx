import "./Register.css";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/voter.service";
import { RegisterModel } from "../types/index";
import { IErrorResponse } from "../types/ResponseModel";

const Register = () => {
  const [formData, setRegisterData] = React.useState<RegisterModel>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<string[]>([]); // Empty array

  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form validation and submission logic here
    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    // Submit form data
    try {
      await register(formData);
      navigate("/");
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Register</h2>
        <form className="form" onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="form__error-message">
              {errors.map((msg, index) => (
                <p key={index}>{`* ${msg}`}</p>
              ))}
            </div>
          )}

          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Full name"
            autoComplete="true"
            autoFocus
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            autoComplete="true"
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
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="true"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <p>
            Already have an account? <Link to="/">Sign In</Link>
          </p>
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
