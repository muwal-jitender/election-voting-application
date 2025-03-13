import "./Login.css";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { login } from "../../services/voter.service";
import { voteActions } from "../../store/vote-slice";
import { ILoginModel } from "../../types/index";
import { IErrorResponse } from "../../types/ResponseModel";
import { setToken } from "../../utils/auth.utils";

const Login = () => {
  const [formData, setRegisterData] = React.useState<ILoginModel>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string[]>([]); // Empty array
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({ ...formData, [name]: value });
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Submit form data
    try {
      const result = await login(formData);
      // Save user in local storage
      result.data && setToken(result.data.token);
      // Save in redux state
      dispatch(
        voteActions.changeCurrentVoter({
          id: result.data?.response.id,
          token: result.data?.token,
          isAdmin: result.data?.response.isAdmin,
        }),
      );

      navigate("/results");
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    <section className="login">
      <div className="container login__container">
        <h2>Log In</h2>
        <form className="form" onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="form__error-message">
              {errors.map((msg, index) => (
                <p key={index}>{`* ${msg}`}</p>
              ))}
            </div>
          )}

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
