import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./store";
import App from "./views/App";
import { ErrorBoundary } from "./errorHandler";
import { supabase } from "./supabase";
import { setUser } from "./slices/user";
import { setInitializedUserSession } from "purenote-core";

initializeApp();

async function initializeState() {
  function initliazeUserSession(session) {
    const user = session ? session.user : null;
    store.dispatch(setUser(user));
    store.dispatch(setInitializedUserSession(true));
  }

  supabase.auth.onAuthStateChange((event, session) => {
    initliazeUserSession(session);
    // console.log("supabase.auth.onAuthStateChange", event, session);

    // if (event === "INITIAL_SESSION") {
    //   // handle initial session
    // } else if (event === "SIGNED_IN") {
    //   // handle sign in event
    // } else if (event === "SIGNED_OUT") {
    //   // handle sign out event
    // } else if (event === "PASSWORD_RECOVERY") {
    //   // handle password recovery event
    // } else if (event === "TOKEN_REFRESHED") {
    //   // handle token refreshed event
    // } else if (event === "USER_UPDATED") {
    //   // handle user updated event
    // }
  });
}

function initializeUI() {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

function initializeApp() {
  initializeState();
  initializeUI();
}
