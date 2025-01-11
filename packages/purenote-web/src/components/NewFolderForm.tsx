import React, { useState } from "react";

export const NewFolderForm = ({
  onClose,
  createFolder,
}: {
  onClose: () => void;
  createFolder: (name: string) => Promise<void>;
}) => {
  const [name, setName] = useState("New Folder Name");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createFolder(name);
    onClose();
  };
  return (
    <div className="position-fixed top-0 start-0 h-100 w-100 z-3 d-flex flex-column align-items-center">
      <div className="position-absolute bg-dark top-0 start-0 h-100 w-100 opacity-25"></div>
      <div className="position-relative h-100 d-flex flex-row align-items-center">
        <div className="card text-center">
          <div className="card-header">
            New Folder
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
                <label htmlFor="inputName" className="col-sm-3 col-form-label">
                  Folder Name:
                </label>
                <div className="col-sm-9">
                  <div className="row g-3">
                    <div className="col">
                      <input
                        placeholder="Folder Name"
                        type="text"
                        className="form-control"
                        name="name"
                        id="inputName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
