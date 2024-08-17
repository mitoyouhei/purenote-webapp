// src/components/PrivateRoute.js
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Spinner from "./Spinner";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);

  onAuthStateChanged(auth, () => setLoading(false));

  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
