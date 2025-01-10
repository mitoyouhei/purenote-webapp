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
  folder,
  email,
  userDisplayName,
  onLogout,
  onAddNote,
  onNoteChange,
  notes,
  folders,
  updateNoteTitle,
  onDeleteNote,
  resetPassword,
  createFolder,
  defaultFolder,
  isTrashFolder,
  trashFolder,
  onFolderDeleteClick,
  onMoveNoteToFolder,
}: {
  note: any;
  folder: any;
  email: string;
  userDisplayName: string;
  onLogout: () => void;
  onAddNote: () => Promise<void>;
  onNoteChange: (content: string) => Promise<void>;
  notes: any[];
  folders: any[];
  updateNoteTitle: (title: string) => Promise<void>;
  onDeleteNote: () => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  onFolderDeleteClick: (id: string) => void;
  defaultFolder: any;
  trashFolder: any;
  isTrashFolder: boolean;
  onMoveNoteToFolder?: (folderId: string) => void;
}) => {
  const disableSidebar = window.innerWidth < 768; // follow bootstrap breadpoints Medium
  const [showSetting, setShowSetting] = useState(false);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const activeNoteId = note?.id;
  const activeFolderId = folder?.id;
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
        userDisplayName={userDisplayName}
        onLogout={onLogout}
        onSettingClick={() => setShowSetting(true)}
        editor={editor}
        topbar={
          <Topbar
            isTrashFolder={isTrashFolder}
            activeId={activeNoteId}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            folders={folders}
            defaultFolder={defaultFolder}
            onMoveNoteToFolder={onMoveNoteToFolder}
          />
        }
        noteList={
          <NoteList
            activeId={activeNoteId}
            notes={notes}
            folderId={activeFolderId}
          />
        }
        folderList={
          <FolderList
            trashFolder={trashFolder}
            defaultFolder={defaultFolder}
            activeId={activeFolderId}
            folders={folders}
            onNewFolderClick={() => setShowNewFolderForm(true)}
            onFolderDeleteClick={onFolderDeleteClick}
          />
        }
      />
    </>
  );
};


