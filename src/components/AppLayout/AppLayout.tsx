import React, { useRef, useState } from "react";

export const AppLayout = ({
  initSiderbarWidth,
  onSidebarWidthChange,
  editor,
  sidebar,
}: {
  initSiderbarWidth: number;
  onSidebarWidthChange: (width: number) => void;
  editor: React.ReactNode;
  sidebar: React.ReactNode;
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
        {sidebar}
      </div>
    </div>
  );
};
