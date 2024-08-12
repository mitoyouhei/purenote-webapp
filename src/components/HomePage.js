import React from "react";

const HomePage = () => {
  return (
    <>
      <div
        className="text-center"
        style={{
          backgroundColor: "#f5e6c7",
          padding: 100,
          boxShadow: "rgb(65 65 65 / 20%) 0px 0px 20px 0px",
        }}
      >
        <img
          src="/full-logo-w800.png"
          alt="nature"
          className="img-fluid"
          style={{ width: 500 }}
        />
      </div>
      <div className="text-center p-5">
        <h1 className="p-5">
          Writing, Thinking, Creating - No Need for Complexity!
        </h1>
        <p className="fs-4 mx-auto pb-5" style={{ maxWidth: 700 }}>
          Pure Note is a note-taking app focused on simplicity and speed. With
          distraction-free writing mode and cloud synchronization, it helps you
          capture your ideas anytime, anywhere.
        </p>
      </div>

      <div
        className="text-center"
        style={{
          backgroundColor: "#f5e6c7",
          padding: 100,
          boxShadow: "rgb(65 65 65 / 20%) 0px 0px 20px 0px",
        }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h5>Simple Interface</h5>
              <p>Distraction-free writing environment</p>
            </div>
            <div className="col">
              <h5>Cloud Sync</h5>
              <p>Notes synchronized across all devices</p>
            </div>
            <div className="col">
              <h5>Cross-Platform</h5>
              <p>Available on Windows, Mac, Linux, iOS, Android, and Web</p>
            </div>
            <div className="col">
              <h5>Lexical</h5>
              <p>
                An text-editor emphasizing reliability, accessibility, and
                performance
              </p>
            </div>
          </div>
        </div>
        <img src="/app-sample.png" alt="nature" className="img-fluid" />
      </div>

      <div className="text-center p-5">
        <h1 className="p-5">Open Source</h1>
        <p className="mx-auto pb-5" style={{ maxWidth: 700 }}>
          All Pure Note code will be open source, inviting developers to
          contribute, inspect, and enhance the application.
        </p>
        <p className="fs-4 mx-auto pb-5" style={{ maxWidth: 700 }}>
          Explore our code on
          <a
            href="https://github.com/waterdrop-lab/justnote-webapp"
            target="_blank"
            rel="noreferrer"
            className="d-block fs-6"
          >
            github.com/waterdrop-lab/justnote-webapp
          </a>
          <a
            href="https://github.com/waterdrop-lab/justnote-server"
            target="_blank"
            rel="noreferrer"
            className="d-block fs-6"
          >
            github.com/waterdrop-lab/justnote-server
          </a>
        </p>
      </div>
    </>
  );
};

export default HomePage;
