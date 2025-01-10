import "./FolderList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFolder2, BsThreeDots } from "react-icons/bs";
// import { formatDateTime } from "../utils";

const defaultNoteTitle = "Untitled";

import { FolderData } from "../supabase/types";

const FolderNav = ({
  folder,
  showMenu,
  onMenuClick,
  isActive,
  onFolderDeleteClick,
  isDefaultFolder = false,
}: {
  folder: FolderData;
  showMenu: boolean;
  onMenuClick: (id: string) => void;
  isActive: boolean;
  onFolderDeleteClick: (id: string) => void;
  isDefaultFolder?: boolean;
}) => {
  return (
    <Link
      className={`d-flex align-items-center justify-content-between list-group-item list-group-item-action rounded-1 ${
        isActive ? "active" : ""
      } ${showMenu ? "z-3" : ""}`}
      to={`/folder/${folder.id}/${
        folder.notes && folder.notes.length > 0 && folder.notes[0] ? folder.notes[0] : "welcome"
      }`}
    >
      <div className="d-flex align-items-center">
        <BsFolder2 className="me-1 folder-icon" />
        <div className="title-row">
          {folder.name || defaultNoteTitle}{" "}
        </div>
      </div>

      <div
        className="position-relative d-flex align-items-center flex-row-reverse"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="badge">{folder.notes ? folder.notes.length : 0}</span>
        {!isDefaultFolder && (
          <>
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
              className={`menu-dropdown position-absolute top-100 end-0 mt-1 ${
                showMenu ? "show" : ""
              }`}
            >
              <div className="card" style={{ backgroundColor: "#000" }}>
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
          </>
        )}
      </div>
    </Link>
  );
};

export const FolderList = ({
  activeId,
  folders,
  onNewFolderClick,
  onFolderDeleteClick,
  defaultFolder,
}: {
  activeId: string;
  folders: FolderData[];
  defaultFolder: FolderData;
  onNewFolderClick: () => void;
  onFolderDeleteClick: (id: string) => void;
}) => {
  const [showMenuForFolder, setShowMenuForFolder] = useState<string | null>(null);
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
      <FolderNav
        onFolderDeleteClick={() => {}} // Default folder cannot be deleted
        folder={defaultFolder}
        isActive={defaultFolder.id === activeId}
        showMenu={showMenuForFolder === defaultFolder.id}
        onMenuClick={() => {
          if (showMenuForFolder === defaultFolder.id) {
            clearMenu();
          } else {
            setShowMenuForFolder(defaultFolder.id);
          }
        }}
        isDefaultFolder={true}
      />
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
