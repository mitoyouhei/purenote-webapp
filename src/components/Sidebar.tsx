import { Link } from "react-router-dom";
import { HiMiniPlus, HiMiniUserCircle, HiTrash } from "react-icons/hi2";
import { formatDateTime } from "../utils";
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
  return (
    <Link
      className={`list-group-item list-group-item-action my-2 border-1 rounded-1 ${
        isActive ? "active" : ""
      }`}
      to={`/note/${item.id}`}
    >
      <div className="title-row">
        <b>{item.title ? item.title : defaultNoteTitle}</b>
      </div>
      <small className="fw-lighter" style={{ fontSize: ".675em" }}>
        {formatDateTime(item.updated_at)}
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
          <div className="d-flex">
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
              style={{ display: addingNote ? "none" : "block" }}
              onClick={async () => {
                setAddingNote(true);
                await onAddNote();
                setAddingNote(false);
              }}
            >
              <HiMiniPlus />
            </span>
            <span
              className="btn"
              style={{
                display: addingNote ? "block" : "none",
                paddingTop: "0.7rem",
              }}
            >
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
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
