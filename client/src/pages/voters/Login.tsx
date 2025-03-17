import "./Login.css";

import * as Yup from "yup";

import { Link, useNavigate } from "react-router-dom";
import { getToken, getUser, setToken } from "../../utils/auth.utils";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import PasswordInput from "../../components/ui/PasswordInput";
import { login } from "../../services/voter.service";
import { voteActions } from "../../store/vote-slice";
import { ILoginModel } from "../../types/index";
import { IErrorResponse } from "../../types/ResponseModel";

// ✅ Define Yup Validation Schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [serverErrors, setServerErrors] = useState<string[]>([]); // ✅ Server-side errors
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Initialize React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginModel>({
    resolver: yupResolver(validationSchema), // Uses Yup for validation
  });

  // Handle form submission
  const onSubmit = async (formData: ILoginModel) => {
    // Submit form data
    try {
      const result = await login(formData);
      // Save user in local storage
      result.data && setToken(result.data.token);
      const user = getUser();
      // Save in redux state
      user &&
        dispatch(
          voteActions.changeCurrentVoter({
            id: user.id,
            token: getToken(),
            isAdmin: user.isAdmin,
          }),
        );

      navigate("/results");
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    <section className="login">
      <div className="container login__container">
        <h2>Log In</h2>
        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverErrors.length > 0 && (
            <div className="form__error-message">
              {serverErrors.map((msg, index) => (
                <p key={index}>{`* ${msg}`}</p>
              ))}
            </div>
          )}
          {/* ✅ Display Client-Side Validation Errors */}
          <div>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              autoComplete="true"
              autoFocus
              className={`${errors.email ? "input-error" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="form__client-error-message">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <PasswordInput
              id="password"
              register={register}
              error={errors.password}
            />
          </div>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <button type="submit" className="btn primary">
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
