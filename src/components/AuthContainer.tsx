import React, { ReactNode } from "react";
import Spinner from "./Spinner";

interface AuthContainerProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  title,
  children,
  loading = false,
  error = null,
}) => {
  const errorMessage = error ? (
    <div className="alert alert-danger mt-2" role="alert">
      {error}
    </div>
  ) : null;

  return (
    <div className="container my-5" style={{ maxWidth: "500px" }}>
      <h1>{title}</h1>
      {loading ? <Spinner /> : children}
      {errorMessage}
    </div>
  );
};
