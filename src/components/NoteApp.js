import React from "react";
import Sidebar from "./Sidebar";
import Note from "./Note";

const NoteApp = () => {
  return (
    <div className="container-fluid position-fixed h-100">
      <div className="row h-100">
        <div className="col-lg-3 bg-light h-100" style={{ overflow: "auto" }}>
          <Sidebar />
        </div>
        <div className="col-lg-9 h-100 px-0" style={{ paddingBottom: "29px" }}>
          <Note />
        </div>
      </div>
    </div>
  );
};

export default NoteApp;
