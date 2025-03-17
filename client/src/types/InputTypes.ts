import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
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
