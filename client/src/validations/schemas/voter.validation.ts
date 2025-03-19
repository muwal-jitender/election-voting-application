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

// ✅ Define Password Rules for Dynamic Validation
export const passwordRules = [
  { rule: /.{8,}/, message: "At least 8 characters" },
  { rule: /[A-Z]/, message: "At least one uppercase letter (A-Z)" },
  { rule: /[0-9]/, message: "At least one number (0-9)" },
  { rule: /[\W_]/, message: "At least one special character (!@#$%^&*)" },
];
