import "./Sidebar.css";
import { Link } from "react-router-dom";
import { HiMiniPlus, HiMiniUserCircle, HiTrash } from "react-icons/hi2";
import { extractText, formatDateTime } from "../utils";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Setting from "./Setting";

const defaultNoteTitle = "Untitled";

const UserMenuToggle = React.forwardRef<
  HTMLSpanElement,
  { onClick: () => void }
>(({ onClick }, ref) => (
  <span className="btn" onClick={onClick} ref={ref}>
    <HiMiniUserCircle />
  </span>
));

const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
  const text = item.content ? ": " + extractText(item.content, 200) : "";
  return (
    <Link
      className={`list-group-item list-group-item-action my-2 rounded-1 ${
        isActive ? "active" : ""
      }`}
      to={`/note/${item.id}`}
    >
      <div className="title-row">
        {item.title ? item.title : defaultNoteTitle}
      </div>
      <small className="fw-lighter">
        {formatDateTime(item.updated_at)}
        {text}
      </small>
    </Link>
  );
};

export const Sidebar = ({
  id,
  userDisplayName,
  onAddNote,
  onDeleteNote,
  onLogout,
  items,
  resetPassword,
  email,
}: {
  id: string;
  userDisplayName: string;
  email: string;
  onAddNote: () => Promise<void>;
  onDeleteNote: () => void;
  onLogout: () => void;
  items: any[];
  resetPassword: (password: string) => Promise<void>;
}) => {
  const [showSetting, setShowSetting] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  return (
    <>
      {showSetting ? (
        <Setting
          email={email}
          onClose={() => setShowSetting(false)}
          resetPassword={resetPassword}
        />
      ) : null}
      <nav className="navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="/logo-title.png"
              alt="Pure Note"
              style={{ width: 100 }}
            ></img>
          </Link>
          <div className="d-flex sidebar-toolbar">
            <Dropdown>
              <Dropdown.Toggle as={UserMenuToggle} />

              <Dropdown.Menu align={{ sm: "end" }}>
                <Dropdown.Header>{userDisplayName}</Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setShowSetting(true)}>
                  Setting
                </Dropdown.Item>
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

            {id && (
              <span className="btn" onClick={onDeleteNote}>
                <HiTrash />
              </span>
            )}
          </div>
        </div>
      </nav>
      <div
        className="notes-list list-group px-2"
        style={{ overflow: "visible" }}
      >
        {items.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === id} />
        ))}
      </div>
    </>
  );
};
