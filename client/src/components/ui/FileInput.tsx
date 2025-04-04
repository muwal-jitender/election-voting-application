import { FieldValues, Path, PathValue } from "react-hook-form";

import { useRef } from "react";
import { IFileProps } from "types/InputTypes";

const FileInput = <T extends FieldValues>({
  id,
  error,
  setValue,
  clearErrors, // ✅ Function to clear field-level validation errors
}: IFileProps<T>) => {
  // 📌 Reference to the file input (used to reset it if needed)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      {/* 📁 File input element */}
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        className={error ? "input-error" : ""}
        accept=".png, .jpg, .jpeg, .webp, .avif"
        onChange={(e) => {
          const file = e.target.files?.[0] as PathValue<T, Path<T>>;

          if (file) {
            // ✅ A file was selected, set the value and clear any errors
            clearErrors(id);
            setValue(id, file);
          } else {
            // ❌ User canceled file selection, reset input manually
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setValue(id, null as PathValue<T, Path<T>>);
          }
        }}
      />

      {/* ⚠️ Validation error display */}
      {error && (
        <p className="form__client-error-message">* {String(error.message)}</p>
      )}
    </div>
  );
};

export default FileInput;
