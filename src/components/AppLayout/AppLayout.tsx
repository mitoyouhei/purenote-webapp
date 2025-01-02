import React, { useRef, useState } from "react";
import { BsLayoutSidebar } from "react-icons/bs";

function minNoteListWidth() {
  return 250;
}
function minFolderListWidth() {
  return 150;
}

export const AppLayout = ({
  editor,
  noteList,
  folderList,
  topbar,
}: {
  editor: React.ReactNode;
  noteList: React.ReactNode;
  folderList: React.ReactNode;
  topbar: React.ReactNode;
}) => {
  const [widthOpacity, setWidthOpacity] = useState(0);

  const [showFolderList, setShowFolderList] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const sidebarRef = useRef(sidebarWidth);

  const [folderListWidth, setFolderListWidth] = useState(200);
  const folderListRef = useRef(folderListWidth);

  const folderListToggle = () => {
    const nextShowFolderList = !showFolderList;
    setShowFolderList(nextShowFolderList);

    if (nextShowFolderList) {
      const nextSidebarWidth = Math.min(
        window.innerWidth / 2,
        sidebarWidth + folderListWidth
      );
      setSidebarWidth(nextSidebarWidth);
      sidebarRef.current = nextSidebarWidth;
    } else {
      const nextSidebarWidth = sidebarWidth - folderListWidth;

      setSidebarWidth(nextSidebarWidth);
      sidebarRef.current = nextSidebarWidth;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = sidebarRef.current;
    setWidthOpacity(0.4);

    const handleMouseMove: EventListener = (e: Event) => {
      const changeX = (e as MouseEvent).clientX - startX;
      let newWidth = startWidth + changeX;

      const minWidth = showFolderList
        ? minNoteListWidth() + minFolderListWidth()
        : minNoteListWidth();

      newWidth = Math.min(window.innerWidth / 2, newWidth);
      newWidth = Math.max(minWidth, newWidth);
      newWidth = Math.floor(newWidth);
      sidebarRef.current = newWidth;
      setSidebarWidth(sidebarRef.current);

      const nextNoteListWidth = sidebarRef.current - folderListWidth;
      if (nextNoteListWidth < minNoteListWidth()) {
        const nextFolderListWidth = sidebarRef.current - minNoteListWidth();
        setFolderListWidth(nextFolderListWidth);
        folderListRef.current = nextFolderListWidth;
      }
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // onSidebarWidthChange(sidebarRef.current);
      setWidthOpacity(0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
  };

  const handleFolderListMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = folderListRef.current;

    const handleFolderListMouseMove: EventListener = (e: Event) => {
      const changeX = (e as MouseEvent).clientX - startX;
      let newWidth = startWidth + changeX;

      newWidth = Math.min(sidebarWidth - minNoteListWidth(), newWidth);
      newWidth = Math.max(minFolderListWidth(), newWidth);

      folderListRef.current = newWidth;
      setFolderListWidth(folderListRef.current);
    };

    const handleFolderListMouseUp = () => {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleFolderListMouseMove);
      document.removeEventListener("mouseup", handleFolderListMouseUp);
      // onSidebarWidthChange(noteListRef.current);
    };

    document.addEventListener("mousemove", handleFolderListMouseMove);
    document.addEventListener("mouseup", handleFolderListMouseUp);
    document.body.style.userSelect = "none";
  };

  // function resetSidebarWidth() {
  //   sidebarRef.current = 300;
  //   setSidebarWidth(sidebarRef.current);
  //   onSidebarWidthChange(sidebarRef.current);
  // }

  return (
    <div className="position-fixed h-100">
      <div
        className="position-fixed  top-0 start-0 h-100 w-100"
        style={{ paddingLeft: sidebarWidth }}
      >
        {editor}
      </div>

      <div
        className="h-100 shadow-sm position-fixed"
        style={{
          overflow: "auto",
          width: sidebarWidth,
        }}
      >
        <div className="h-100 d-flex flex-row position-relative">
          <div
            className="h-100 bg-secondary-subtle overflow-hidden position-relative"
            style={{
              width: showFolderList ? folderListWidth : 0,
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
              paddingTop: 44,
            }}
          >
            <div
              className="resize-dragger position-absolute top-0 end-0 h-100 border-start"
              onMouseDown={handleFolderListMouseDown}
            />
            {folderList}
          </div>
          <div
            className="h-100"
            style={{
              width: sidebarWidth - (showFolderList ? folderListWidth : 0),
            }}
          >
            {topbar}
            {noteList}
          </div>
          <div
            className="topbar position-absolute top-0 start-0"
            style={{ padding: "8px" }}
          >
            <span className="btn" onClick={folderListToggle}>
              <BsLayoutSidebar />
            </span>
          </div>
        </div>

        <div
          className="position-absolute top-0 end-0 px-1"
          style={{ fontSize: "10px", opacity: widthOpacity }}
        >
          {sidebarWidth}px
        </div>
        <div
          className="resize-dragger position-absolute top-0 end-0 h-100 border-end"
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};
