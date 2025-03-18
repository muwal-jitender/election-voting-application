import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import { HTMLInputTypeAttribute } from "react";

export interface IInputProps<T extends FieldValues> {
  id: Path<T>;
  register: UseFormRegister<T>;
  error: FieldErrors<T>[Path<T>];
  placeholder: string;
  type: HTMLInputTypeAttribute;
  autoFocus?: boolean;
}
export interface ITextareaProps<T extends FieldValues>
  extends Omit<IInputProps<T>, "type" | "autoFocus"> {}

export interface IFileProps<T extends FieldValues>
  extends Omit<
    IInputProps<T>,
    "type" | "autoFocus" | "placeholder" | "register"
  > {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
}
