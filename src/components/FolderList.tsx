import "./FolderList.css";
import React from "react";
import { Link } from "react-router-dom";
// import { formatDateTime } from "../utils";

const defaultNoteTitle = "Untitled";

const FolderNav = ({
  folder,
  isActive,
}: {
  folder: any;
  isActive: boolean;
}) => {
  return (
    <Link
      className={`list-group-item list-group-item-action my-2 rounded-1 ${
        isActive ? "active" : ""
      }`}
      to={`/folder/${folder.id}`}
    >
      <div className="title-row">
        {folder.title ? folder.title : defaultNoteTitle}
      </div>
    </Link>
  );
};

export const FolderList = ({
  activeId,
  folders,
}: {
  activeId: string;
  folders: any[];
}) => {
  return (
    <div
      className="folder-list list-group px-2"
      style={{ overflow: "visible" }}
    >
      {folders.map((folder) => (
        <FolderNav
          key={folder.id}
          folder={folder}
          isActive={folder.id === activeId}
        />
      ))}
    </div>
  );
};
