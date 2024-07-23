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
function globalErrorHandler(error) {
  const json = errorToJSON(error);
  console.error("🚀 ~ global error log", json);
}

window.onerror = function (message, source, lineno, colno, error) {
  console.log("🚀 ~ onerror ~ Global error caught:", {
    message,
    source,
    lineno,
    colno,
    error,
  });

  globalErrorHandler({
    message,
    source,
    lineno,
    colno,
    error,
  });
  // 在这里可以进行日志记录或用户提示
  return true; // 如果返回 true，表示错误已经被处理，浏览器不会再报告错误
};

window.addEventListener("error", function (event) {
  console.log("🚀 ~ addEventListener ~ Global error caught:", event);
  // 在这里可以进行日志记录或用户提示
  globalErrorHandler(event);
  return true;
});
window.addEventListener("unhandledrejection", function (event) {
  console.log(
    "🚀 ~ addEventListener ~ Unhandled Promise rejection:",
    event.reason
  );
  globalErrorHandler(event.reason);
  // 在这里可以进行日志记录或用户提示
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
    console.log("🚀 ~ Error boundary caught an error:", error, errorInfo);
    globalErrorHandler({ ...errorToJSON(error), ...errorInfo });
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
