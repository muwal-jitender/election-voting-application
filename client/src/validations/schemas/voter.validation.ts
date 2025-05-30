import * as Yup from "yup";

import YupPassword from "yup-password";

// ✅ Define Yup Validation Schema
export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

YupPassword(Yup); // extend yup

// ✅ Define Yup Validation Schema
export const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .minUppercase(1, "Password is required")
    .minNumbers(1, "At least one number")
    .minSymbols(1, "At least one special character")
    .min(8, "At least one uppercase letter")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password do not match")
    .required("Confirm Password is required"),
});

// ✅ Define Password Rules for Dynamic Validation
export const passwordRules = [
  { rule: /.{8,}/, message: "At least 8 characters" },
  { rule: /[A-Z]/, message: "At least one uppercase letter (A-Z)" },
  { rule: /[0-9]/, message: "At least one number (0-9)" },
  { rule: /[\W_]/, message: "At least one special character (!@#$%^&*)" },
];

// ✅ Define 2FA Validation Schema
export const twoFaValidationSchema = Yup.object().shape({
  code: Yup.string()
    .trim()
    .required("Code is required.")
    .min(6, "Please enter a 6-digit code.")
    .max(6, "Please enter a 6-digit code."),
  secret: Yup.string().trim().required("Secret is required"),
});
