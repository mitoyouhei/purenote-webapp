import axios from "axios";
import React from "react";
import { store } from "./store";
import { clearErrorMessage, setErrorMessage } from "./slices/client";

async function errorLog(error) {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_END_POINT_URL}/api/logs`,
      error
    );
  } catch (error) {
    console.error("TODO", error);
  }
}

export function errorToJSON(error) {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
    ...error,
  };
}
let errorMessageTimer = null;
export function setGlobalErrorToast(message, dissmisedAfter) {
  store.dispatch(setErrorMessage(message));
  if (isNaN(dissmisedAfter)) return;
  clearTimeout(errorMessageTimer);
  errorMessageTimer = setTimeout(() => {
    store.dispatch(clearErrorMessage());
  }, dissmisedAfter);
}
export function globalErrorHandler(error, reference) {
  try {
    const json = errorToJSON(error);
    setGlobalErrorToast(json.message, 5000);
    errorLog(json);
    console.warn("🚀 ~ global error log " + reference, json);
  } catch (error) {
    console.error(error);
  } finally {
    return true;
  }
}

window.onerror = function (message, source, lineno, colno, error) {
  return globalErrorHandler(
    {
      message,
      source,
      lineno,
      colno,
      error,
    },
    "window.onerror"
  );
};

window.addEventListener("error", function (event) {
  return globalErrorHandler(event, "window.addEventListener error");
});
window.addEventListener("unhandledrejection", function (event) {
  return globalErrorHandler(
    event.reason,
    "window.addEventListener unhandledrejection"
  );
});

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    return globalErrorHandler(
      { ...errorToJSON(error), ...errorInfo },
      "React ErrorBoundary"
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <nav className="navbar  bg-body-tertiary">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">
                <img
                  src="/logo-name.png"
                  alt="Pure Note"
                  style={{ width: 180 }}
                ></img>
              </a>
              <div>
                <a href="/login" className="btn btn-primary me-2">
                  Login
                </a>
                <a href="/register" className="btn btn-primary me-2">
                  Register
                </a>
              </div>
            </div>
          </nav>
          <div className="container text-center m-5 d-flex flex-column align-items-center">
            <h1>Something went wrong.</h1>
            <p>Please try again or contact support if the problem persists.</p>
            <div className="alert alert-danger" role="alert">
              {this.state.error.message}
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
