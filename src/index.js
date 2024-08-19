import "bootstrap/dist/css/bootstrap.min.css";
// import "./bootstrap.solar.min.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import { store } from "./store";
import App from "./components/App";
import { ErrorBoundary } from "./errorHandler";
import { auth } from "./firebase";
import { clearUser, setUser } from "./slices/user";
import Spinner from "./components/Spinner";

initializeApp();

function initializeApp() {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  onAuthStateChanged(auth, (user) => {
    if (user) {
      store.dispatch(setUser(user.toJSON()));
    } else {
      store.dispatch(clearUser());
    }

    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <Provider store={store}>
            <App />
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  });

  root.render(<Spinner />);
}

