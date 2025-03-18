import { FieldValues } from "react-hook-form";
import { ITextareaProps } from "../../types/InputTypes";

const TextareaInput = <T extends FieldValues>({
  id,
  register,
  error,
  placeholder,
}: ITextareaProps<T>) => {
  return (
    <div>
      <textarea
        id={id}
        placeholder={`Enter ${placeholder}`}
        cols={60}
        rows={10}
        {...register(id)}
        className={error ? "input-error" : ""}
      ></textarea>

      {error && (
        <p className="form__client-error-message">* {String(error.message)}</p>
      )}
    </div>
  );
};

export default TextareaInput;
