import "./Topbar.css";
// import { Link } from "react-router-dom";
import { HiMiniPlus, HiMiniUserCircle, HiTrash, HiArrowRight } from "react-icons/hi2";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

const UserMenuToggle = React.forwardRef<
  HTMLSpanElement,
  { onClick: () => void }
>(({ onClick }, ref) => (
  <span className="btn" onClick={onClick} ref={ref}>
    <HiMiniUserCircle />
  </span>
));

export const Topbar = ({
  activeId,
  userDisplayName,
  onAddNote,
  onDeleteNote,
  onLogout,
  onSettingClick,
}: {
  activeId: string;
  userDisplayName: string;
  onAddNote: () => Promise<void>;
  onDeleteNote: () => void;
  onLogout: () => void;
  onSettingClick: () => void;
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
          <Dropdown>
            <Dropdown.Toggle as={UserMenuToggle} />

            <Dropdown.Menu>
              <Dropdown.Header>{userDisplayName}</Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onSettingClick}>Setting</Dropdown.Item>
              <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <span
            className="btn"
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
                      <Dropdown.Item onClick={() => onMoveNoteToFolder?.(defaultFolder.id)}>
                        {defaultFolder.name}
                      </Dropdown.Item>
                    )}
                    {defaultFolder && folders.length > 0 && <Dropdown.Divider />}
                    {folders.map(folder => (
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
              <span className="btn" onClick={onDeleteNote}>
                <HiTrash />
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
