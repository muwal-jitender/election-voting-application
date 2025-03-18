import { FieldValues, Path, PathValue } from "react-hook-form";

import { useRef } from "react";
import { IFileProps } from "../../types/InputTypes";

const FileInput = <T extends FieldValues>({
  id,
  error,
  setValue,
  clearErrors, // ✅ Added to clear the error when a file is selected
}: IFileProps<T>) => {
  // ✅ Reference to the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <input
        type="file"
        id={id}
        ref={fileInputRef} // ✅ Attach ref to input
        className={error ? "input-error" : ""}
        onChange={(e) => {
          const file = e.target.files?.[0] as PathValue<T, Path<T>>;
          if (file) {
            clearErrors(id); // ✅ Clear error message when file is selected
            setValue(id, file);
          } else {
            // ✅ If user cancels a previously selected file, reset the file input manually
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setValue(id, null as PathValue<T, Path<T>>);
          }
        }}
        accept=".png, .jpg, .jpeg, .webp, .avif"
      />

      {error && (
        <p className="form__client-error-message">* {String(error.message)}</p>
      )}
    </div>
  );
};

export default FileInput;
