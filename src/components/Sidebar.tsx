import "./Sidebar.css";
import { Link } from "react-router-dom";
import { HiMiniPlus, HiMiniUserCircle, HiTrash } from "react-icons/hi2";
import { extractText, formatDateTime } from "../utils";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Setting from "./Setting";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  items: initialItems,
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
  const [items, setItems] = useState(initialItems);

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
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          
          // Reorder items array
          const reorderedItems = [...items];
          const [movedItem] = reorderedItems.splice(result.source.index, 1);
          reorderedItems.splice(result.destination.index, 0, movedItem);
          
          // Update local state only - no persistence needed as per requirements
          setItems(reorderedItems);
        }}
      >
        <Droppable droppableId="notesList">
          {(provided) => (
            <div
              className="notes-list list-group px-2"
              style={{ overflow: "visible" }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                      }}
                    >
                      <NavItem item={item} isActive={item.id === id} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
