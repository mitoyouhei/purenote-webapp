import React, { useEffect } from "react";
import Spinner from "../components/Spinner";
import { logout } from "../store";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    async function logoutUser() {
      await logout();
      navigate("/login");
    }
    logoutUser();
  }, [navigate]);
  return <Spinner />;
};
