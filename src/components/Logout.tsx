import React, { useEffect } from "react";
import Spinner from "./Spinner";
import { store } from "../store";
import { logout } from "../slices/user";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    async function logoutUser() {
      store.dispatch(logout(null));
      await signOut(auth);
      navigate("/login");
    }
    logoutUser();
  }, [navigate]);
  return <Spinner />;
};

export default Logout;