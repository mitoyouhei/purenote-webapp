import React, { useEffect, useState, useMemo } from "react";

import { NoteApp } from "../components/NoteApp";
import { useParams } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Note as NoteType } from "../supabase/types";
import { useNavigate } from "react-router-dom";
import {
  supabase,
  createNote,
  updateNoteTitle,
  updateNoteContent,
  deleteNote,
  initRootFolder,
  updateFolder,
  findFolderByNoteId,
} from "../supabase";
import Spinner from "../components/Spinner";
import {
  getNotes,
  getRootFolder,
  findFolderById,
  addNoteToFolder,
} from "../supabase";
// Use the imported Folder type from supabase/types
import type { RootFolder, FolderData } from "../supabase/types";
const defaultFolder: FolderData = {
  id: "default",
  name: "Notes",
  folders: null,
  notes: []
};

function findUncontainedNotes(folders: FolderData[], notesList: NoteType[]): NoteType[] {
  const containedNoteIds = new Set<string>();

  function collectNotes(folder: FolderData) {
    if (folder.notes) {
      folder.notes.forEach((noteId: string) => containedNoteIds.add(noteId));
    }
    if (Array.isArray(folder.folders)) {
      folder.folders.forEach(collectNotes);
    }
  }

  folders.forEach(collectNotes);

  return notesList.filter((note) => !containedNoteIds.has(note.id));
}

export const Note = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const userId = user.id;
  const { folderId, noteId } = useParams();

  const [notes, setNotes] = useState<NoteType[]>([]);
  const [rootFolder, setRootFolder] = useState<RootFolder>({
    id: "",
    user_id: userId,
    deleted_at: null,
    root: {
      folders: [{
        id: crypto.randomUUID(),
        name: "Root",
        folders: null,
        notes: []
      }]
    },
    created_at: null,
    updated_at: null
  });
  const [initialized, setInitialized] = useState(false);
  const isDefaultFolder = defaultFolder.id === folderId;
  const allFolders = useMemo(() => rootFolder.root?.folders ?? [], [rootFolder.root?.folders]);
  const defaultFolderNotes = useMemo(() => findUncontainedNotes(allFolders, notes), [allFolders, notes]);
  defaultFolder.notes = defaultFolderNotes.map((note) => note.id);

  const folder = isDefaultFolder || !folderId
    ? defaultFolder
    : (allFolders.length > 0 ? findFolderById(allFolders, folderId) : null);

  const folderNotes = useMemo(() => {
    if (!notes) return [];
    if (isDefaultFolder) {
      return findUncontainedNotes(allFolders, notes);
    }
    const noteIds = folder?.notes ?? [];
    return noteIds.map((noteId: string) =>
      notes.find((note: NoteType) => note.id === noteId)
    ).filter((note): note is NoteType => note !== undefined);
  }, [isDefaultFolder, folder, notes, allFolders]);

  const note: NoteType | null = folderNotes.find((note: NoteType) => note.id === noteId) ?? null;

  async function onAddNote() {
    const currentFolderId = folderId;
    if (!currentFolderId) {
      console.error("folderId is required for adding a note");
      return;
    }

    const response = await createNote(userId);
    if (!response?.data || !response.data.id) {
      console.error('Failed to create note:', response?.error);
      return;
    }
    
    const newNote = response.data;
    if (!isDefaultFolder && rootFolder?.root?.folders) {
      const allFolders = rootFolder.root.folders;
      addNoteToFolder(allFolders, currentFolderId, newNote.id);
      const updateResponse = await updateFolder(rootFolder.user_id, rootFolder);
      if (updateResponse.error) {
        console.error('Failed to update folder:', updateResponse.error);
      } else if (updateResponse.data) {
        setRootFolder(updateResponse.data);
      }
    }
    setNotes([newNote, ...notes]);

    navigate(`/folder/${currentFolderId}/${newNote.id}`);
  }
  async function onDeleteNote() {
    if (!noteId) return;
    
    const deleteResponse = await deleteNote(noteId);
    if (!deleteResponse?.data) {
      console.error('Failed to delete note:', deleteResponse?.error);
      return;
    }

    const restNotes = notes.filter((note) => note.id !== noteId);

    if (!isDefaultFolder && rootFolder?.root?.folders) {
      const allFolders = rootFolder.root.folders;
      const folder = findFolderByNoteId(allFolders, noteId);
      if (folder && folder.notes) {
        folder.notes = folder.notes.filter((id: string) => id !== noteId);
        const updateResponse = await updateFolder(rootFolder.user_id, rootFolder);
        if (updateResponse.error) {
          console.error('Failed to update folder:', updateResponse.error);
        } else if (updateResponse.data) {
          setRootFolder(updateResponse.data);
        }
      }
    }

    setNotes(restNotes);
    const currentFolderId = folderId;
    if (!currentFolderId) {
      console.error("No folder ID available for navigation");
      return;
    }
    if (restNotes.length > 0) {
      navigate(`/folder/${currentFolderId}/${restNotes[0].id}`);
    } else {
      navigate(`/folder/${currentFolderId}/welcome`);
    }
  }

  useEffect(() => {
    const currentFolderId = folderId;
    if (!note && folderNotes.length > 0 && currentFolderId) {
      navigate(`/folder/${currentFolderId}/${folderNotes[0]?.id ?? 'welcome'}`);
    }
  }, [note, folderNotes, folderId, navigate]);
  useEffect(() => {
    if (!folder && rootFolder.root?.folders?.length > 0) {
      // Navigate to the first available folder
      navigate(`/folder/${rootFolder.root.folders[0].id}/welcome`);
    }
  }, [folder, rootFolder, navigate]);
  useEffect(() => {
    const currentFolderId = folderId;
    if (folder && folderNotes.length < 1 && currentFolderId) {
      navigate(`/folder/${currentFolderId}/welcome`);
    }
  }, [folder, note, folderNotes, folderId, navigate]);

  useEffect(() => {
    async function getOrCreateRootFolder(): Promise<RootFolder | null> {
      const rootFolderResponse = await getRootFolder(userId);
      if (!rootFolderResponse?.data) {
        const initResponse = await initRootFolder(userId);
        if (!initResponse?.data) {
          console.error('Failed to initialize root folder:', initResponse?.error);
          return null;
        }
        return initResponse.data;
      }
      return rootFolderResponse.data;
    }
    async function fetchData() {
      const [rootFolder, notes] = await Promise.all([
        getOrCreateRootFolder(),
        getNotes(userId),
      ]);

      if (rootFolder) {
        setRootFolder(rootFolder);
      }
      if (Array.isArray(notes)) {
        setNotes(notes);
      } else {
        console.error('Failed to fetch notes');
        setNotes([]);
      }
      setInitialized(true);
    }
    fetchData();
  }, [userId]);

  async function createFolder(name: string) {
    const newFolder: FolderData = {
      id: crypto.randomUUID(),
      name,
      folders: null,
      notes: []
    };
    const newRoot: RootFolder = {
      ...rootFolder,
      root: { folders: [...(rootFolder.root?.folders ?? []), newFolder] }
    };
    
    const response = await updateFolder(userId, newRoot);
    if (response.error) {
      console.error('Failed to create folder:', response.error);
      return;
    }
    if (response.data) {
      setRootFolder(response.data);
    }
  }

  if (!initialized) return <Spinner />;
  return (
    <NoteApp
      defaultFolder={defaultFolder}
      email={user.email ?? ""}
      onFolderDeleteClick={async (id: string) => {
        console.log("onFolderDeleteClick", id);
      }}
      note={note}
      folder={folder}
      notes={folderNotes}
      folders={rootFolder?.root?.folders ?? []}
      userDisplayName={user.email ?? ""}
      createFolder={createFolder}
      onLogout={() => {
        navigate("/logout");
      }}
      updateNoteTitle={async (title: string) => {
        if (!noteId || !note) return;
        const response = await updateNoteTitle(noteId, title);
        if (!response?.data) {
          console.error('Failed to update note title:', response?.error);
          return;
        }
        const updatedNote = response.data;
        if (!updatedNote) return;
        setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
      }}
      onDeleteNote={onDeleteNote}
      onAddNote={onAddNote}
      onNoteChange={async (content: string) => {
        if (!noteId || !note) return;
        const response = await updateNoteContent(noteId, content);
        if (!response?.data) {
          console.error('Failed to update note content:', response?.error);
          return;
        }
        const updatedNote = response.data;
        if (!updatedNote) return;
        setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
      }}
      resetPassword={async (password: string) => {
        if (!user?.email) return;
        await supabase.auth.updateUser({ password });
      }}
    />
  );
};
