import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { MdOutlineClose } from "react-icons/md";
import { store } from "../store";
import { clearSuccessMessage } from "../slices/client";

const SuccessToast = () => {
  const client = useSelector((state: any) => state.client);
  if (!client.successMessage) return null;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      store.dispatch(clearSuccessMessage());
    }, 3000);
    return () => clearTimeout(timer);
  }, [client.successMessage]);

  return (
    <div
      className="toast align-items-center text-bg-success border-0 show position-fixed bottom-0 end-0 m-2"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="toast-body">{client.successMessage}</div>
        <button
          type="button"
          style={{ color: "#fff" }}
          className="btn"
          onClick={() => store.dispatch(clearSuccessMessage())}
        >
          <MdOutlineClose />
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;
