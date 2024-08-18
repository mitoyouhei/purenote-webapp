import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { useSelector } from "react-redux";
import { auth } from "../firebase";

const Setting = ({ onClose }: { onClose: () => void }) => {
  const user = useSelector((state: any) => state.user);

  return (
    <div className="position-fixed top-0 start-0 h-100 w-100 z-3 d-flex flex-column align-items-center">
      <div className="position-absolute bg-dark top-0 start-0 h-100 w-100 opacity-25"></div>
      <div className="position-relative h-100 d-flex flex-row align-items-center">
        <div className="card text-center">
          <div className="card-header">
            Setting
            <button
              type="button"
              onClick={onClose}
              className="btn-close float-end"
              aria-label="Close"
            ></button>
          </div>
          <div className="card-body">
            <div>
              <button
                className="btn btn-primary m-1"
                onClick={async () => {
                  await sendPasswordResetEmail(auth, user.email);
                }}
              >
                Reset Password
              </button>
              <p></p>
            </div>
          </div>

          <div className="card-footer">
            <button className="btn btn-light m-1" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary m-1">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
