import "./App.css";
import React, { useEffect } from "react";
import SystemInfo from "../components/SystemInfo";
import ErrorToast from "../components/ErrorToast";
import AppRoutes from "./AppRoutes";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const handleSaveShortcut = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    console.log("Save shortcut triggered");
  }
};

const App = () => {
  const initialized = useSelector(
    (state: RootState) => state.client.initialized
  );
  useEffect(() => {
    document.addEventListener("keydown", handleSaveShortcut);
    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, []);
  if (!initialized) return <Spinner />;
  return (
    <>
      <AppRoutes />
      <SystemInfo />
      <ErrorToast />
    </>
  );
};

export default App;
