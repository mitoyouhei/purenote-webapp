import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./store"; // 修改为从 store.js 导入
import "bootstrap/dist/css/bootstrap.min.css";
// import "./bootstrap.solar.min.css";
import App from "./components/App";
function errorToJSON(error) {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
    ...error,
  };
}
function globalErrorHandler(error, reference) {
  const json = errorToJSON(error);
  console.warn("🚀 ~ global error log " + reference, json);
  return true;
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 以触发下一次渲染时显示回退 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    return globalErrorHandler(
      { ...errorToJSON(error), ...errorInfo },
      "React ErrorBoundary"
    );
  }

  render() {
    // if (this.state.hasError) {
    //   // 你可以自定义回退 UI
    //   return <h1>Something went wrong.</h1>;
    // }

    return this.props.children;
  }
}

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
