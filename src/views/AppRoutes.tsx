import React from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import PublicLayout from "../components/PublicLayout";
import { LandingPage } from "../components/landing";

import { Register } from "./Register";
import { Login } from "./Login";
import { Home } from "./Home";
import { Logout } from "./Logout";
import { Note } from "./Note";
import { Folders } from "./Folders";
import { NotFound } from "./NotFound";
import { Notebooks } from "./Notebooks";
import { RootState } from "../store";
import { EmailVerification } from "./EmailVerification";


const AppRoutes = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />
        <Route
          path="/email-verification"
          element={
            <PublicLayout>
              <EmailVerification />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/folder/default/welcome" />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/note/:id"
          element={<Navigate to="/folder/default/welcome" />}
        />
        <Route
          path="/folder/:folderId/:noteId"
          element={user ? <Note user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/folders"
          element={user ? <Folders /> : <Navigate to="/login" />}
        />
        <Route
          path="/notebooks"
          element={user ? <Notebooks /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
