import "./Register.css";

import * as Yup from "yup";

import { Link, useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import YupPassword from "yup-password";
import ApiErrorMessage from "../../components/ui/ApiErrorMessage";
import PasswordInput from "../../components/ui/PasswordInput";
import TextInput from "../../components/ui/TextInput";
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
    .min(8, "")
    .minUppercase(1, "")
    .minNumbers(1, "")
    .minSymbols(1, "")
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
    watch, // ✅ Add watch to track live changes in password input
  } = useForm<IRegisterModel>({
    resolver: yupResolver(validationSchema),
  });
  // ✅ Watch password input value for live validation feedback
  const passwordValue = watch("password", "");
  // ✅ Define Password Rules for Dynamic Validation
  const passwordRules = [
    { rule: /.{8,}/, message: "At least 8 characters" },
    { rule: /[A-Z]/, message: "At least one uppercase letter (A-Z)" },
    { rule: /[0-9]/, message: "At least one number (0-9)" },
    { rule: /[\W_]/, message: "At least one special character (!@#$%^&*)" },
  ];

  // Handle form submission
  const onSubmit = async (formData: IRegisterModel) => {
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
          <button type="submit" className="btn primary">
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
