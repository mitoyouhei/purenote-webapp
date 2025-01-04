import "./FolderList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFolder2, BsThreeDots } from "react-icons/bs";
// import { formatDateTime } from "../utils";

const defaultNoteTitle = "Untitled";

const FolderNav = ({
  folder,
  showMenu,
  onMenuClick,
  isActive,
  onFolderDeleteClick,
}: {
  folder: any;
  showMenu: boolean;
  onMenuClick: (id: string) => void;
  isActive: boolean;
  onFolderDeleteClick: (id: string) => void;
}) => {
  return (
    <Link
      className={`d-flex align-items-center justify-content-between list-group-item list-group-item-action rounded-1 ${
        isActive ? "active" : ""
      }`}
      to={`/folder/${folder.id}/welcome`}
    >
      <div className="d-flex align-items-center">
        <BsFolder2 className="me-1 folder-icon" />
        <div className="title-row">
          {folder.name ? folder.name : defaultNoteTitle}
        </div>
      </div>

      <div
        className="position-relative"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <button
          className="btn btn-light menu-btn"
          onClick={(e) => {
            e.preventDefault();
            onMenuClick(folder.id);
          }}
        >
          <BsThreeDots />
        </button>
        <div
          className={`menu-dropdown position-absolute top-100 end-0 mt-1 z-2 ${
            showMenu ? "show" : ""
          }`}
        >
          <div className="card">
            <ul className="list-group list-group-flush">
              <li
                className="list-group-item"
                onClick={() => onFolderDeleteClick(folder.id)}
              >
                Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const FolderList = ({
  activeId,
  folders,
  onNewFolderClick,
  onFolderDeleteClick,
}: {
  activeId: string;
  folders: any[];
  onNewFolderClick: () => void;
  onFolderDeleteClick: (id: string) => void;
}) => {
  const [showMenuForFolder, setShowMenuForFolder] = useState(null);
  const clearMenu = () => {
    setShowMenuForFolder(null);
  };
  useEffect(() => {
    document.addEventListener("click", clearMenu);
    return () => {
      document.removeEventListener("click", clearMenu);
    };
  }, []);
  return (
    <div
      className="folder-list list-group px-2"
      style={{ overflow: "visible" }}
    >
      {folders.map((folder) => (
        <FolderNav
          onFolderDeleteClick={onFolderDeleteClick}
          key={folder.id}
          folder={folder}
          isActive={folder.id === activeId}
          showMenu={showMenuForFolder === folder.id}
          onMenuClick={() => {
            if (showMenuForFolder === folder.id) {
              clearMenu();
            } else {
              setShowMenuForFolder(folder.id);
            }
          }}
        />
      ))}
      <button
        className="btn btn-sm btn-light my-3"
        style={{ whiteSpace: "nowrap" }}
        onClick={onNewFolderClick}
      >
        New Folder
      </button>
    </div>
  );
};
