import "./App.css";
import React, { useEffect } from "react";
import SystemInfo from "../components/SystemInfo";
import ErrorToast from "../components/ErrorToast";
import AppRoutes from "./AppRoutes";
import Spinner from "../components/Spinner";
import TitleBar from "../components/TitleBar";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const handleSaveShortcut = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    console.log("Save shortcut triggered");
  }
};

const App = () => {
  const initializedUserSession = useSelector(
    (state: RootState) => state.client.initializedUserSession
  );
  useEffect(() => {
    document.addEventListener("keydown", handleSaveShortcut);
    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, []);
  if (!initializedUserSession) return <Spinner />;
  return (
    <>
      <TitleBar />
      <div style={{ marginTop: '30px' }}>
        <AppRoutes />
        <SystemInfo />
        <ErrorToast />
      </div>
    </>
  );
};

export default App;
