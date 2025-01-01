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


  const setting = showSetting ? (
    <Setting
      email={email}
      onClose={() => setShowSetting(false)}
      resetPassword={resetPassword}
    />
  ) : null;
  const editor = note ? (
    <Note
      showFolderListNav={disableSidebar}
      id={note.id}
      note={note}
      onChange={onNoteChange}
      updateNoteTitle={updateNoteTitle}
    />
  ) : (
    <Welcome onAddNote={onAddNote} userDisplayName={userDisplayName} />
  );

  return (
    <>
      {setting}
      <AppLayout
        initSiderbarWidth={initSiderbarWidth}
        onSidebarWidthChange={onSidebarWidthChange}
        editor={editor}
        topbar={
          <Topbar
            activeId={activeId}
            userDisplayName={userDisplayName}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            onLogout={onLogout}
            onSettingClick={() => setShowSetting(true)}
          />
        }
        noteList={<NoteList activeId={activeId} notes={notes} />}
      />
    </>
  );
};
