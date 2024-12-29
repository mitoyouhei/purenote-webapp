import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./store";
import App from "./views/App";
import { ErrorBoundary } from "./errorHandler";
import { supabase } from "./supabase";
import { setUser } from "./slices/user";
import { setInitialized } from "./slices/client";

initializeApp();

async function initializeState() {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session);

    if (event === "INITIAL_SESSION") {
      // handle initial session
    } else if (event === "SIGNED_IN") {
      // handle sign in event
    } else if (event === "SIGNED_OUT") {
      // handle sign out event
    } else if (event === "PASSWORD_RECOVERY") {
      // handle password recovery event
    } else if (event === "TOKEN_REFRESHED") {
      // handle token refreshed event
    } else if (event === "USER_UPDATED") {
      // handle user updated event
    }
  });

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  if (data.session?.user) {
    store.dispatch(setUser(data.session.user));
    console.log("supabase user", data.session.user);
  }
  store.dispatch(setInitialized(true));
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
