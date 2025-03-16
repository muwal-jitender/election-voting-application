import "./Register.css";

import * as Yup from "yup";

import { Link, useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import YupPassword from "yup-password";
import { registerVoter } from "../../services/voter.service";
import { IRegisterModel } from "../../types/index";
import { IErrorResponse } from "../../types/ResponseModel";

YupPassword(Yup); // extend yup

// ✅ Define Yup Validation Schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Fullname is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .minUppercase(1, "Password must contain at least one uppercase letter")
    .minNumbers(1, "Password must contain at least one number")
    .minSymbols(1, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password do not match")
    .required("Confirm Password is required"),
});
const Register = () => {
  const [serverErrors, setServerErrors] = useState<string[]>([]); // Empty array

  const navigate = useNavigate();

  // ✅ Initialize React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterModel>({
    resolver: yupResolver(validationSchema),
  });

  // Handle form submission
  const onSubmit = async (formData: IRegisterModel) => {
    // Add form validation and submission logic here
    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    // Submit form data
    try {
      await registerVoter(formData);
      navigate("/");
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Register</h2>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {serverErrors.length > 0 && (
            <div className="form__error-message">
              {serverErrors.map((msg, index) => (
                <p key={index}>{`* ${msg}`}</p>
              ))}
            </div>
          )}
          <div>
            {errors.fullName && (
              <p className="form__client-error-message">
                * {errors.fullName?.message}
              </p>
            )}
            <input
              type="text"
              id="fullName"
              placeholder="Full name"
              autoComplete="true"
              autoFocus
              {...register("fullName")}
            />
          </div>
          <div>
            {errors.email && (
              <p className="form__client-error-message">
                * {errors.email.message}
              </p>
            )}

            <input
              type="email"
              id="email"
              placeholder="Email Address"
              autoComplete="true"
              {...register("email")}
            />
          </div>
          <div>
            {errors.password && (
              <p className="form__client-error-message">
                * {errors.password.message}
              </p>
            )}

            <input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="true"
              {...register("password")}
            />
          </div>
          <div>
            {errors.confirmPassword && (
              <p className="form__client-error-message">
                * {errors.confirmPassword.message}
              </p>
            )}
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="true"
              {...register("confirmPassword")}
            />
          </div>
          <p>
            Already have an account? <Link to="/">Sign In</Link>
          </p>
          <button type="submit" className="btn primary">
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
