import { FieldValues } from "react-hook-form";
import { IInputProps } from "../../types/InputTypes";

const TextInput = <T extends FieldValues>({
  id,
  register,
  error,
  placeholder,
  type,
  autoFocus = false,
}: IInputProps<T>) => {
  return (
    <div>
      <input
        type={type}
        id={id}
        placeholder={`Enter ${placeholder}`}
        autoComplete="true"
        autoFocus={autoFocus}
        {...register(id)}
        className={error ? "input-error" : ""}
      />
      {error && (
        <p className="form__client-error-message">* {String(error.message)}</p>
      )}
    </div>
  );
};

export default TextInput;
