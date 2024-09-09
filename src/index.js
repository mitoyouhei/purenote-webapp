import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import { logout, persistor, store } from "./store";
import App from "./App";
import { ErrorBoundary } from "./errorHandler";
import { auth } from "./firebase";
import { setUser } from "./slices/user";
import Spinner from "./components/Spinner";
import { PersistGate } from "redux-persist/integration/react";

initializeApp();

function initializeApp() {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      store.dispatch(setUser(user.toJSON()));
    } else {
      await logout();
    }

    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <Provider store={store}>
            <PersistGate loading={<Spinner />} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  });

  root.render(<Spinner />);
}
