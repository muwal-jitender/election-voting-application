const ApiErrorMessage = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;
  return (
    <div className="form__error-message">
      {errors.map((msg, index) => (
        <p key={index}>{`* ${msg}`}</p>
      ))}
    </div>
  );
};

export default ApiErrorMessage;
