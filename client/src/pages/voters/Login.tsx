import "./Login.css";

import { Link, useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import ApiErrorMessage from "components/ui/ApiErrorMessage";
import Button from "components/ui/Button";
import PasswordInput from "components/ui/PasswordInput";
import TextInput from "components/ui/TextInput";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "services/voter.service";
import { ILoginModel } from "types/index";
import { IErrorResponse } from "types/ResponseModel";
import { setUser } from "utils/auth.utils";
import { loginValidationSchema } from "validations/schemas/voter.validation";

const Login = () => {
  const [serverErrors, setServerErrors] = useState<string[]>([]); // ✅ Server-side errors

  const navigate = useNavigate();

  // ✅ Initialize React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginModel>({
    resolver: yupResolver(loginValidationSchema), // Uses Yup for validation
  });

  // Handle form submission
  const onSubmit = async (formData: ILoginModel) => {
    // Submit form data
    try {
      const result = await login(formData);
      // Save user in local storage

      const user = result.data;
      // Save in redux state
      user && setUser(user);

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
          {/* ✅ Display Server-Side Validation Error messages */}
          <ApiErrorMessage errors={serverErrors} />

          <div>
            <TextInput
              error={errors.email}
              id="email"
              placeholder="email address"
              register={register}
              type="email"
              autoFocus={true}
            />
          </div>
          <div>
            <PasswordInput
              id="password"
              register={register}
              error={errors.password}
              placeholder="password"
              type="password"
            />
          </div>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
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
