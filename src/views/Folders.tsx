import React from "react";
import Sidebar from "../components/Sidebar";

export const Folders: React.FC = () => {
  return (
    <div className="container-sm">
      <div className="row justify-content-center">
        <div className="col-sm-4 align-self-center">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
