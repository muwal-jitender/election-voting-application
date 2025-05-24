import { FieldValues } from "react-hook-form";
import { IInputProps } from "types/InputTypes";

const TextInput = <T extends FieldValues>({
  id,
  register,
  error,
  placeholder,
  type,
  autoFocus = false,
  inputMode = "text",
}: IInputProps<T>) => {
  return (
    <div>
      <label htmlFor={id} className="visually-hidden">
        {placeholder}
      </label>
      <input
        type={type}
        id={id}
        placeholder={`Enter ${placeholder}`}
        autoComplete="true"
        autoFocus={autoFocus}
        inputMode={inputMode}
        {...register(id)}
        className={error ? "input-error" : ""}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="form__client-error-message"
          role="alert"
        >
          * {String(error.message)}
        </p>
      )}
    </div>
  );
};

export default TextInput;
