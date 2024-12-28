import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./store";
import App from "./views/App";
import { ErrorBoundary } from "./errorHandler";
import { provider } from "./supabase";
import { initialize } from "./core";

initializeApp();

function initializeApp() {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  initialize(provider);

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
