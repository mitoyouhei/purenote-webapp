import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="container-sm m-5">
      <div className="row justify-content-center">
        <div className="col-sm-4 align-self-center">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
