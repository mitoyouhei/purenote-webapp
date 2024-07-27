import axios from "axios";
import React from "react";

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
export function globalErrorHandler(error, reference) {
  try {
    const json = errorToJSON(error);
    errorLog(json);
    console.warn("🚀 ~ global error log " + reference, json);
  } catch (error) {
    console.error(error);
  }
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

export class ErrorBoundary extends React.Component {
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
