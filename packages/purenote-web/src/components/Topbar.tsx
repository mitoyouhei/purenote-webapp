import "./Topbar.css";
// import { Link } from "react-router-dom";
import { HiMiniPlus, HiTrash, HiArrowRight } from "react-icons/hi2";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";


export const Topbar = ({
  activeId,
  onAddNote,
  onDeleteNote,
  isTrashFolder,
  folders,
  defaultFolder,
  onMoveNoteToFolder,
}: {
  activeId: string;
  onAddNote: () => Promise<void>;
  onDeleteNote: () => void;
  isTrashFolder: boolean;
  folders?: { id: string; name: string }[];
  defaultFolder?: { id: string; name: string };
  onMoveNoteToFolder?: (folderId: string) => void;
}) => {
  const [addingNote, setAddingNote] = useState(false);

  return (
    <nav className="navbar topbar">
      <div className="container-fluid">
        <div className="d-flex"></div>
        <div className="d-flex">
          <span
            className={`btn ${isTrashFolder ? "d-none" : ""}`}
            onClick={async () => {
              setAddingNote(true);
              await onAddNote();
              setAddingNote(false);
            }}
          >
            <span
              className="spinner-border spinner-border-sm position-absolute"
              style={{ top: 14, display: addingNote ? "block" : "none" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </span>
            <HiMiniPlus style={{ opacity: addingNote ? 0 : 1 }} />
          </span>

          {activeId && (
            <>
              {folders && (
                <Dropdown>
                  <Dropdown.Toggle as="span" className="btn">
                    <HiArrowRight />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {defaultFolder && (
                      <Dropdown.Item
                        onClick={() => onMoveNoteToFolder?.(defaultFolder.id)}
                      >
                        {defaultFolder.name}
                      </Dropdown.Item>
                    )}
                    {defaultFolder && folders.length > 0 && (
                      <Dropdown.Divider />
                    )}
                    {folders.map((folder) => (
                      <Dropdown.Item
                        key={folder.id}
                        onClick={() => onMoveNoteToFolder?.(folder.id)}
                      >
                        {folder.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <span
                className={`btn ${isTrashFolder ? "d-none" : ""}`}
                onClick={onDeleteNote}
              >
                <HiTrash />
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
