import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./store"; // 修改为从 store.js 导入
import "bootstrap/dist/css/bootstrap.min.css";
// import "./bootstrap.solar.min.css";
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
