import "./Login.css";

import { Link, useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import ApiErrorMessage from "components/ui/ApiErrorMessage";
import Button from "components/ui/Button";
import PasswordInput from "components/ui/PasswordInput";
import TextInput from "components/ui/TextInput";
import { useUser } from "context/UserContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { voterService } from "services/voter.service";
import { ILoginModel } from "types";
import { IErrorResponse } from "types/ResponseModel";
import { loginValidationSchema } from "validations/schemas/voter.validation";

const Login = () => {
  const [serverErrors, setServerErrors] = useState<string[]>([]); // 🔴 Server-side error messages
  const { setUser } = useUser(); // 🔗 Access user context
  const navigate = useNavigate(); // 🚀 Navigate after login

  // 🧾 Initialize React Hook Form with Yup schema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginModel>({
    resolver: yupResolver(loginValidationSchema),
  });

  // ✅ Handle form submission
  const onSubmit = async (formData: ILoginModel) => {
    try {
      const result = await voterService.login(formData); // 🔐 Call login API
      const user = result.data;

      if (user) {
        setUser(user); // ✅ Set user in context
        if (user.isAdmin) {
          toast.success("You’ve been logged in as Admin");
        }
        navigate("/results"); // ➡️ Redirect to results page
      }
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    <section className="login">
      <div className="container login__container">
        <h2>Log In</h2>

        {/* 📝 Login Form */}
        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ⚠️ Server-side error display */}
          <ApiErrorMessage errors={serverErrors} />

          {/* 📧 Email Input */}
          <div>
            <TextInput
              error={errors.email}
              id="email"
              placeholder="email address"
              register={register}
              type="email"
              autoFocus={true}
              aria-label="email address"
            />
          </div>

          {/* 🔒 Password Input with toggle */}
          <div>
            <PasswordInput
              id="password"
              register={register}
              error={errors.password}
              placeholder="password"
              type="password"
              aria-label="password"
            />
          </div>

          {/* 🔗 Navigation to registration */}
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>

          {/* 🚀 Submit Button */}
          <div>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
