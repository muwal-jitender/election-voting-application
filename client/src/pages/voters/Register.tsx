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
import { toast } from "react-toastify";
import { voterService } from "services/voter.service";
import { IRegisterModel } from "types/index";
import { IErrorResponse } from "types/ResponseModel";

const Register = () => {
  // ❗Server-side error messages from failed registration
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  // 🧾 Setup react-hook-form with Yup schema validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch, // 👁️ Used to track live password input value
  } = useForm<IRegisterModel>({
    resolver: yupResolver(registerValidationSchema),
  });

  // 🔍 Get current password value for rule validation feedback
  const passwordValue = watch("password", "");

  // ✅ Handle form submit
  const onSubmit = async (formData: IRegisterModel) => {
    try {
      await voterService.register(formData); // 🔐 API call
      toast.success("Registration successful! Please log in.");
      navigate("/"); // ➡️ Redirect to login on success
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    <section
      className={`register ${Object.keys(errors).length ? "register--has-error" : ""}`}
    >
      <div className="container register__container">
        <h2>Register</h2>

        {/* 📝 Registration Form */}
        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ⚠️ Server-side error display */}
          <ApiErrorMessage errors={serverErrors} />

          {/* 👤 Full Name */}
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

          {/* 📧 Email Address */}
          <div>
            <TextInput
              error={errors.email}
              id="email"
              placeholder="email address"
              register={register}
              type="email"
            />
          </div>

          {/* 🔒 Password + Rule Validation */}
          <div>
            <PasswordInput
              id="password"
              register={register}
              error={errors.password}
              placeholder="password"
              type="password"
            />

            {/* 📋 Live Password Rule Validation */}
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

          {/* 🔁 Confirm Password */}
          <div>
            <PasswordInput
              id="confirmPassword"
              register={register}
              error={errors.confirmPassword}
              placeholder="Confirm password"
              type="password"
            />
          </div>

          {/* 🔗 Navigation to login */}
          <p>
            Already have an account? <Link to="/">Sign In</Link>
          </p>

          {/* 🚀 Register Submit Button */}
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Register
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Register;
