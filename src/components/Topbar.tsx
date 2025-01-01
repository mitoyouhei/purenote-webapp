import "./Topbar.css";
import { Link } from "react-router-dom";
import { HiMiniPlus, HiMiniUserCircle, HiTrash } from "react-icons/hi2";
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
}) => {
  const [addingNote, setAddingNote] = useState(false);

  return (
    <nav className="navbar topbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="/logo-title.png"
            alt="Pure Note"
            style={{ width: 100 }}
          ></img>
        </Link>
        <div className="d-flex">
          <Dropdown>
            <Dropdown.Toggle as={UserMenuToggle} />

            <Dropdown.Menu align={{ sm: "end" }}>
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
              style={{ top: 20, display: addingNote ? "block" : "none" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </span>
            <HiMiniPlus style={{ opacity: addingNote ? 0 : 1 }} />
          </span>

          {activeId && (
            <span className="btn" onClick={onDeleteNote}>
              <HiTrash />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};
