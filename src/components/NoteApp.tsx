import React, { useState } from "react";
import Note from "./Note";
import Welcome from "./Welcome";
import { AppLayout } from "./AppLayout";
import { NoteList } from "./NoteList";
import { Topbar } from "./Topbar";
import Setting from "./Setting";
import { FolderList } from "./FolderList";
import { NewFolderForm } from "./NewFolderForm";

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
  folders,
  updateNoteTitle,
  onDeleteNote,
  resetPassword,
  createFolder,
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
  folders: any[];
  updateNoteTitle: (title: string) => Promise<void>;
  onDeleteNote: () => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  createFolder: (name: string) => Promise<void>;
}) => {
  const disableSidebar = window.innerWidth < 768; // follow bootstrap breadpoints Medium
  const [showSetting, setShowSetting] = useState(false);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const activeId = note?.id;

  const newFolderForm = showNewFolderForm ? (
    <NewFolderForm
      onClose={() => setShowNewFolderForm(false)}
      createFolder={createFolder}
    />
  ) : null;
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
      {newFolderForm}
      {setting}
      <AppLayout
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
        folderList={
          <FolderList
            activeId={activeId}
            folders={folders}
            onNewFolderClick={() => setShowNewFolderForm(true)}
          />
        }
      />
    </>
  );
};
