import React, { useState } from "react";
import Spinner from "./Spinner";

const Setting = ({
  onClose,
  email,
  resetPassword,
}: {
  onClose: () => void;
  email: string;
  resetPassword: (password: string) => Promise<void>;
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordNotMatch(false);
    if (password !== confirmPassword) {
      setPasswordNotMatch(true);
      return;
    }

    setLoading(true);
    await resetPassword(password);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  const passwordNotMatchMessage = passwordNotMatch ? (
    <div className="alert alert-danger mt-2" role="alert">
      Password do not match
    </div>
  ) : null;
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
            <form style={{ width: 600 }} onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label htmlFor="inputEmail" className="col-sm-3 col-form-label">
                  Email:
                </label>
                <div className="col-sm-9">
                  <input
                    disabled
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    value={email}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="inputPassword"
                  className="col-sm-3 col-form-label"
                >
                  Reset Password:
                </label>
                <div className="col-sm-9">
                  <div className="row g-3">
                    <div className="col">
                      <input
                        placeholder="Password"
                        type="password"
                        className="form-control"
                        name="password"
                        id="inputPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        placeholder="Confirm Password"
                        type="password"
                        className="form-control"
                        name="confirmpassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <Spinner />
              ) : (
                <button type="submit" className="btn btn-primary">
                  Reset
                </button>
              )}

              {passwordNotMatchMessage}
              {success ? (
                <div className="alert alert-success mt-2" role="alert">
                  Password reset successfully
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
