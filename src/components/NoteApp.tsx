import React, { useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import Note from "./Note";
import { IoIosArrowForward } from "react-icons/io";
import Welcome from "./Welcome";

const NoteApp = ({
  note,
  initSiderbarWidth,
  email,
  userDisplayName,
  onLogout,
  onAddNote,
  onSidebarWidthChange,
  onNoteChange,
  notes,
  updateNoteTitle,
  onDeleteNote,
  resetPassword,
}: {
  note: any;
  email: string;
  initSiderbarWidth: number;
  userDisplayName: string;
  onLogout: () => void;
  onAddNote: () => Promise<void>;
  onSidebarWidthChange: (width: number) => void;
  onNoteChange: (content: string) => Promise<void>;
  notes: any[];
  updateNoteTitle: (title: string) => Promise<void>;
  onDeleteNote: () => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
}) => {
  const disableSidebar = window.innerWidth < 768; // follow bootstrap breadpoints Medium
  const [sidebarWidth, setSidebarWidth] = useState(
    disableSidebar ? 0 : initSiderbarWidth
  );
  const [widthOpacity, setWidthOpacity] = useState(0);
  const sidebarRef = useRef(initSiderbarWidth);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = sidebarRef.current;
    setWidthOpacity(0.4);

    const handleMouseMove: EventListener = (e: Event) => {
      let newWidth = startWidth + (e as MouseEvent).clientX - startX;

      if (newWidth < 200) {
        sidebarRef.current = 0;
      } else {
        newWidth = Math.min(window.innerWidth / 2, newWidth);
        newWidth = Math.max(270, newWidth);
        newWidth = Math.floor(newWidth);
        sidebarRef.current = newWidth;
      }

      setSidebarWidth(sidebarRef.current);
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      onSidebarWidthChange(sidebarRef.current);
      setWidthOpacity(0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
  };

  function resetSidebarWidth() {
    sidebarRef.current = 300;
    setSidebarWidth(sidebarRef.current);
    onSidebarWidthChange(sidebarRef.current);
  }

  return (
    <div className="position-fixed h-100">
      <div
        className="position-fixed  top-0 start-0 h-100 w-100"
        style={{ paddingLeft: sidebarWidth }}
      >
        {note ? (
          <Note
            showFolderListNav={disableSidebar}
            id={note.id}
            note={note}
            onChange={onNoteChange}
            updateNoteTitle={updateNoteTitle}
          />
        ) : (
          <Welcome onAddNote={onAddNote} userDisplayName={userDisplayName} />
        )}
      </div>

      <div
        className="h-100 shadow-sm position-fixed"
        style={{
          overflow: "auto",
          width: sidebarWidth,
        }}
      >
        <div
          className="sidebar-dragger position-absolute top-0 end-0 px-1"
          style={{ fontSize: "10px", opacity: widthOpacity }}
        >
          {sidebarWidth}px
        </div>
        <div
          id="siderbar-dragger"
          className="position-absolute top-0 end-0 h-100 border-end"
          onMouseDown={handleMouseDown}
        />
        <Sidebar
          email={email}
          id={note?.id}
          items={notes}
          userDisplayName={userDisplayName}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          onLogout={onLogout}
          resetPassword={resetPassword}
        />
      </div>

      {sidebarWidth === 0 && !disableSidebar ? (
        <div
          className="position-fixed start-0 top-50"
          style={{ transform: "translateX(-45%)" }}
        >
          <button
            className="btn btn-outline-secondary"
            onClick={resetSidebarWidth}
          >
            <IoIosArrowForward
              style={{ transform: "translateX(50%) translateY(-10%)" }}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default NoteApp;