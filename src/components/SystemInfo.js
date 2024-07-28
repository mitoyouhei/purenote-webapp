import React, { useState } from "react";
import { Button, Toast } from "react-bootstrap";

const SystemInfo = () => {
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);

  const display =
    process.env.NODE_ENV === "development" ? "inline-block" : "none";
  return (
    <div
      className="position-fixed"
      style={{
        bottom: 10,
        right: 10,
        width: 350,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <Toast show={showA} onClose={toggleShowA}>
        <Toast.Header>
          <strong className="me-auto">System Info</strong>
        </Toast.Header>
        <Toast.Body>
          <p>process.env.NODE_ENV: {process.env.NODE_ENV}</p>
        </Toast.Body>
      </Toast>
      <Button
        onClick={toggleShowA}
        variant="secondary"
        className="mt-2"
        style={{
          "--bs-btn-padding-y": ".15rem",
          "--bs-btn-padding-x": ".3rem",
          "--bs-btn-font-size": ".65rem",
          opacity: 0.3,
          display,
        }}
      >
        system
      </Button>
    </div>
  );
};

export default SystemInfo;
