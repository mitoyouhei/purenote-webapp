import React, { useState } from "react";
import { RegisterForm } from "../components/RegisterForm";
import { supabase } from "purenote-core";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const redirectToEmailVerification = () => {
    navigate("/email-verification");
  };

  const createUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        console.error(error);
        setError(error.message);
      } else if (data.user) {
        redirectToEmailVerification();
      }
    } catch (error: any) {
      console.error(error);
      setError(error);
    }
  };
  return <RegisterForm error={error} createUser={createUser} />;
};
