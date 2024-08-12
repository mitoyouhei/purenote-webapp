import axios from "axios";
import React from "react";
import { store } from "./store";
import { setErrorMessage } from "./slices/client";

async function errorLog(error) {
  await axios.post(
    `${process.env.REACT_APP_API_END_POINT_URL}/api/logs`,
    error
  );
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
export function globalErrorHandler(error, reference) {
  try {
    const json = errorToJSON(error);
    store.dispatch(setErrorMessage(json.message));
    clearTimeout(errorMessageTimer);
    errorMessageTimer = setTimeout(() => {
      store.dispatch(setErrorMessage(null));
    }, 10000);
    errorLog(json);
    console.warn("🚀 ~ global error log " + reference, json);
  } catch (error) {
    console.error(error);
  } finally {
    return false;
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
    return { hasError: true };
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
          <div className="container text-center m-5">
            <h1>Something went wrong.</h1>
            <p>Please try again or contact support if the problem persists.</p>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
