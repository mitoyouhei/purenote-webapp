import React, { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "purenote-core";
import { setUser } from "../slices/user";
import { useDispatch } from "react-redux";

export const Login: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    if (signInError) {
      console.error("signInError", signInError);
      setError(signInError.message);
    } else {
      console.log("signInData", signInData);

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("getSession error", error);
        setError(error.message);
      }
      if (data.session?.user) {
        dispatch(setUser(data.session.user));
        console.log("logged in supabase user", data.session.user);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  return <LoginForm loading={loading} onSubmit={handleSubmit} error={error} />;
};
