import "./Register.css";

import { Link, useNavigate } from "react-router-dom";
import {
  passwordRules,
  registerValidationSchema,
} from "validations/schemas/voter.validation";

import { yupResolver } from "@hookform/resolvers/yup";
import ApiErrorMessage from "components/ui/ApiErrorMessage";
import Button from "components/ui/Button";
import PasswordInput from "components/ui/PasswordInput";
import TextInput from "components/ui/TextInput";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { voterService } from "services/voter.service";
import { IRegisterModel } from "types/index";
import { IErrorResponse } from "types/ResponseModel";

const Register = () => {
  const [serverErrors, setServerErrors] = useState<string[]>([]); // Empty array

  const navigate = useNavigate();

  // ✅ Initialize React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch, // ✅ Add watch to track live changes in password input
  } = useForm<IRegisterModel>({
    resolver: yupResolver(registerValidationSchema),
  });
  // ✅ Watch password input value for live validation feedback
  const passwordValue = watch("password", "");

  // Handle form submission
  const onSubmit = async (formData: IRegisterModel) => {
    // Submit form data
    try {
      await voterService.register(formData);
      navigate("/");
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Register</h2>
        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ✅ Display Server-Side Validation Error messages */}
          <ApiErrorMessage errors={serverErrors} />

          <div>
            <TextInput
              error={errors.fullName}
              id="fullName"
              placeholder="full name"
              register={register}
              type="text"
              autoFocus={true}
            />
          </div>
          <div>
            <TextInput
              error={errors.email}
              id="email"
              placeholder="email address"
              register={register}
              type="email"
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
            <ul className="password-validation">
              {passwordRules.map(({ rule, message }, index) => (
                <li
                  key={index}
                  className={rule.test(passwordValue) ? "valid" : "invalid"}
                >
                  {rule.test(passwordValue) ? "✔️" : "❌"} {message}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <PasswordInput
              id="confirmPassword"
              register={register}
              error={errors.confirmPassword}
              placeholder="Confirm password"
              type="password"
            />
          </div>
          <p>
            Already have an account? <Link to="/">Sign In</Link>
          </p>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Register
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Register;
