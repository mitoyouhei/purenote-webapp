import "./FolderList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFolder2, BsThreeDots, BsTrash } from "react-icons/bs";
import RenameFolderInput from "./RenameFolderInput";
// import { formatDateTime } from "../utils";

const defaultNoteTitle = "Untitled";

const FolderNav = ({
  folder,
  showMenu,
  onMenuClick,
  isActive,
  onFolderDeleteClick,
  onFolderRenameClick,
  editingFolderId,
  setEditingFolderId,
  deleteable,
  showCount,
  navIcon,
}: {
  folder: any;
  showMenu: boolean;
  onMenuClick: (id: string) => void;
  isActive: boolean;
  editingFolderId: string | null;
  setEditingFolderId: (id: string | null) => void;
  onFolderDeleteClick: (id: string) => void;
  onFolderRenameClick?: (id: string, newName: string) => void;
  deleteable: boolean;
  showCount: boolean;
  navIcon?: React.ReactNode;
}) => {
  return (
    <Link
      className={`d-flex align-items-center justify-content-between list-group-item list-group-item-action rounded-1 ${
        isActive ? "active" : ""
      } ${showMenu ? "z-3" : ""}`}
      to={`/folder/${folder.id}/${
        folder.notes?.length > 0 ? folder.notes[0] : "welcome"
      }`}
    >
      <div className="d-flex align-items-center">
        {navIcon ?? <BsFolder2 className="me-1 folder-icon" />}
        {editingFolderId === folder.id ? (
          <RenameFolderInput
            initialValue={folder.name || defaultNoteTitle}
            onConfirm={(newName) => {
              setEditingFolderId(null);
              onFolderRenameClick?.(folder.id, newName);
            }}
            onCancel={() => setEditingFolderId(null)}
          />
        ) : (
          <div className="title-row">
            {folder.name ? folder.name : defaultNoteTitle}{" "}
          </div>
        )}
      </div>

      <div
        className="position-relative d-flex align-items-center flex-row-reverse"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {showCount && (
          <span className="badge">{folder.notes?.length ?? 0}</span>
        )}
        <button
          className={`btn btn-light menu-btn ${deleteable ? "" : "d-none"}`}
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
              {deleteable &&
                folder.id !== "default" &&
                folder.id !== "trash" && (
                  <>
                    <li
                      className="list-group-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingFolderId(folder.id);
                      }}
                    >
                      Rename
                    </li>
                    <li
                      className="list-group-item"
                      onClick={(e) => {
                        e.preventDefault();
                        onFolderDeleteClick(folder.id);
                      }}
                    >
                      Delete
                    </li>
                  </>
                )}
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
  onFolderRenameClick,
  defaultFolder,
  trashFolder,
}: {
  activeId: string;
  folders: any[];
  defaultFolder: any;
  trashFolder: any;
  onNewFolderClick: () => void;
  onFolderDeleteClick: (id: string) => void;
  onFolderRenameClick?: (id: string, newName: string) => void;
}) => {
  const [showMenuForFolder, setShowMenuForFolder] = useState<string | null>(
    null
  );
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
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
        deleteable={false}
        showCount={true}
        editingFolderId={editingFolderId}
        setEditingFolderId={setEditingFolderId}
        onFolderDeleteClick={() => {}}
        onFolderRenameClick={onFolderRenameClick}
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
      />
      {folders.map((folder) => (
        <FolderNav
          editingFolderId={editingFolderId}
          setEditingFolderId={setEditingFolderId}
          onFolderDeleteClick={onFolderDeleteClick}
          onFolderRenameClick={onFolderRenameClick}
          key={folder.id}
          folder={folder}
          isActive={folder.id === activeId}
          deleteable={true}
          showCount={true}
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

      <FolderNav
        editingFolderId={editingFolderId}
        setEditingFolderId={setEditingFolderId}
        deleteable={false}
        showCount={true}
        onFolderDeleteClick={() => {}}
        onFolderRenameClick={onFolderRenameClick}
        folder={trashFolder}
        isActive={trashFolder.id === activeId}
        showMenu={false}
        onMenuClick={() => {}}
        navIcon={<BsTrash className="me-1 folder-icon" />}
      />
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
