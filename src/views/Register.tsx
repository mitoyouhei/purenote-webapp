import React, { useState } from "react";
import { RegisterForm } from "../components/RegisterForm";

export const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <RegisterForm
      loading={false}
      error={error}
      createUser={async () => {
        setError("failed create user");
      }}
    />
  );
};
