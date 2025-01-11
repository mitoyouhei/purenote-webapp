import { useSelector } from "react-redux";
import { MdOutlineClose, MdRefresh } from "react-icons/md";
import { store } from "../store";
import { clearErrorMessage } from "purenote-core";

const ErrorToast = () => {
  const client = useSelector((state) => state.client);
  if (!client.errorMessage) return null;
  return (
    <div
      className="toast align-items-center text-bg-danger border-0 show position-fixed bottom-0 end-0 m-2"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="toast-body">{client.errorMessage}</div>

        <div>
          <button
            type="button"
            style={{ color: "#fff" }}
            className="btn"
            onClick={() => window.location.reload()}
          >
            <MdRefresh />
          </button>
          <button
            type="button"
            style={{ color: "#fff" }}
            className="btn"
            onClick={() => store.dispatch(clearErrorMessage())}
          >
            <MdOutlineClose />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorToast;
