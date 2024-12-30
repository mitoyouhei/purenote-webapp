import React, { useState } from "react";
import { RegisterForm } from "../components/RegisterForm";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const redirectToEmailVerification = () => {
    navigate("/email-verification");
  };

  const createUser = async (email: string, password: string) => {
    setLoading(true);
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
      console.log(data);
    } catch (error: any) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return <RegisterForm error={error} createUser={createUser} />;
};
