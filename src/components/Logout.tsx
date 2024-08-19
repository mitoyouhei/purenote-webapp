import React, { useEffect } from "react";
import Spinner from "./Spinner";
import { logout } from "../store";
import { useNavigate } from "react-router-dom";

const Logout = () => {
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

export default Logout;
