import React, { useState } from "react";
import Note from "./Note";
import Welcome from "./Welcome";
import { AppLayout } from "./AppLayout";
import { NoteList } from "./NoteList";
import { Topbar } from "./Topbar";
import Setting from "./Setting";

export const NoteApp = ({
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
  const [showSetting, setShowSetting] = useState(false);
  const activeId = note?.id;

  return (
    <AppLayout
      initSiderbarWidth={initSiderbarWidth}
      onSidebarWidthChange={onSidebarWidthChange}
      editor={
        note ? (
          <Note
            showFolderListNav={disableSidebar}
            id={note.id}
            note={note}
            onChange={onNoteChange}
            updateNoteTitle={updateNoteTitle}
          />
        ) : (
          <Welcome onAddNote={onAddNote} userDisplayName={userDisplayName} />
        )
      }
      sidebar={
        <>
          {showSetting ? (
            <Setting
              email={email}
              onClose={() => setShowSetting(false)}
              resetPassword={resetPassword}
            />
          ) : null}
          <Topbar
            activeId={activeId}
            userDisplayName={userDisplayName}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            onLogout={onLogout}
            onSettingClick={() => setShowSetting(true)}
          />
          <NoteList activeId={activeId} notes={notes} />
        </>
      }
    />
  );

  // return (
  //   <div className="position-fixed h-100">
  //     <div
  //       className="position-fixed  top-0 start-0 h-100 w-100"
  //       style={{ paddingLeft: sidebarWidth }}
  //     >
  //       {note ? (
  //         <Note
  //           showFolderListNav={disableSidebar}
  //           id={note.id}
  //           note={note}
  //           onChange={onNoteChange}
  //           updateNoteTitle={updateNoteTitle}
  //         />
  //       ) : (
  //         <Welcome onAddNote={onAddNote} userDisplayName={userDisplayName} />
  //       )}
  //     </div>

  //     <div
  //       className="h-100 shadow-sm position-fixed"
  //       style={{
  //         overflow: "auto",
  //         width: sidebarWidth,
  //       }}
  //     >
  //       <div
  //         className="sidebar-dragger position-absolute top-0 end-0 px-1"
  //         style={{ fontSize: "10px", opacity: widthOpacity }}
  //       >
  //         {sidebarWidth}px
  //       </div>
  //       <div
  //         id="siderbar-dragger"
  //         className="position-absolute top-0 end-0 h-100 border-end"
  //         onMouseDown={handleMouseDown}
  //       />
  //       <Sidebar
  //         email={email}
  //         id={note?.id}
  //         items={notes}
  //         userDisplayName={userDisplayName}
  //         onAddNote={onAddNote}
  //         onDeleteNote={onDeleteNote}
  //         onLogout={onLogout}
  //         resetPassword={resetPassword}
  //       />
  //     </div>

  //     {sidebarWidth === 0 && !disableSidebar ? (
  //       <div
  //         className="position-fixed start-0 top-50"
  //         style={{ transform: "translateX(-45%)" }}
  //       >
  //         <button
  //           className="btn btn-outline-secondary"
  //           onClick={resetSidebarWidth}
  //         >
  //           <IoIosArrowForward
  //             style={{ transform: "translateX(50%) translateY(-10%)" }}
  //           />
  //         </button>
  //       </div>
  //     ) : null}
  //   </div>
  // );
};
