import React, { useEffect, useState, useMemo } from "react";

import { NoteApp } from "../components/NoteApp";
import { useParams } from "react-router-dom";
import { User } from "@supabase/supabase-js";
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
  restoreNote,
  deleteNotes,
  getAllNotes,
  getRootFolder,
  findFolderById,
  addNoteToFolder,
  FolderData as Folder,
  Note as NoteType
} from "purenote-core";
import Spinner from "../components/Spinner";


const defaultFolder: Folder = {
  id: "default",
  name: "Notes",
  folders: [],
  notes: [],
};
const trashFolder: Folder = {
  id: "trash",
  name: "回收站",
  folders: [],
  notes: [],
};

function UnassignedFolderNotes(folder: any, notesList: any[]) {
  const containedNoteIds = new Set();

  function collectNotes(folder: any) {
    if (folder.notes) {
      folder.notes.forEach((noteId: any) => containedNoteIds.add(noteId));
    }
    if (Array.isArray(folder.folders)) {
      folder.folders.forEach(collectNotes);
    }
  }

  collectNotes(folder);

  return notesList.filter((note) => !containedNoteIds.has(note.id));
}
function findParentFolder(root: any, targetFolderId: string): any {
  // 直接遍历root下的folders
  for (const folder of root.folders) {
    if (folder.id === targetFolderId) {
      return root;
    }

    // 递归检查子文件夹
    if (folder.folders) {
      const parent = findParentFolder(folder, targetFolderId);
      if (parent) {
        return parent;
      }
    }
  }

  return null;
}
export const Note = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const userId = user.id;
  const { folderId, noteId } = useParams();

  const [notes, setNotes] = useState<NoteType[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<NoteType[]>([]);
  const [rootFolder, setRootFolder] = useState<any>({
    root: { folders: [] },
  });
  const [initialized, setInitialized] = useState(false);

  const isDefaultFolder = defaultFolder.id === folderId;
  const isTrashFolder = trashFolder.id === folderId;
  const defaultFolderNotes = UnassignedFolderNotes(rootFolder.root, notes);
  defaultFolder.notes = defaultFolderNotes.map((note) => note.id);
  trashFolder.notes = deletedNotes.map((note) => note.id);

  const folder = isTrashFolder
    ? trashFolder
    : isDefaultFolder
    ? defaultFolder
    : findFolderById(rootFolder.root, folderId);

  const folderNotes = useMemo(() => {
    if (isDefaultFolder) {
      return UnassignedFolderNotes(rootFolder.root, notes);
    }
    if (isTrashFolder) {
      return deletedNotes;
    }
    const noteIds = folder?.notes ?? [];
    return noteIds.map((noteId: any) =>
      notes.find((note: any) => note.id === noteId)
    );
  }, [
    isDefaultFolder,
    folder,
    notes,
    rootFolder.root,
    deletedNotes,
    isTrashFolder,
  ]);

  const note = folderNotes.find((note: any) => note.id === noteId);

  async function onAddNote() {
    if (!folderId) throw new Error("folderId is required");

    const newNote = await createNote();
    if (!isDefaultFolder && newNote) {
      addNoteToFolder(rootFolder.root, folderId, newNote.id);
      await updateFolder(rootFolder.user_id, rootFolder.root);
      setRootFolder(rootFolder);
    }
    setNotes([newNote, ...notes]);

    navigate(`/folder/${folderId}/${newNote.id}`);
  }
  async function onDeleteNote() {
    if (!noteId) return;
    const deletedNote = notes.find((note) => note.id === noteId);
    deletedNote.deleted_at = new Date().toISOString();
    const restNotes = notes.filter((note) => note.id !== noteId);

    if (!isDefaultFolder) {
      const folder = findFolderByNoteId(rootFolder.root, noteId);
      if (folder) {
        folder.notes = folder.notes?.filter((id: string) => id !== noteId);
      }
      setRootFolder(rootFolder);
    }
    setDeletedNotes([deletedNote, ...deletedNotes]);
    setNotes(restNotes);
    if (restNotes.length > 0) {
      navigate(`/folder/${folderId}/${restNotes[0].id}`);
    } else {
      navigate(`/folder/${folderId}/welcome`);
    }

    await deleteNote(noteId);
    if (!isDefaultFolder) {
      await updateFolder(rootFolder.user_id, rootFolder.root);
    }
  }
  async function createFolder(name: string) {
    const newFolder = { id: crypto.randomUUID(), name };
    const newRoot = {
      ...rootFolder,
      root: { folders: [...rootFolder.root.folders, newFolder] },
    };
    setRootFolder(newRoot);
    updateFolder(userId, newRoot.root);
  }
  async function onMoveNoteToFolder(targetFolderId: string) {
    if (!note?.id || !rootFolder?.root) return;

    if (isTrashFolder) {
      // restore note
      note.deleted_at = null;
      note.updated_at = new Date().toISOString();
      setNotes([...notes, note]);
      setDeletedNotes(deletedNotes.filter((n) => n.id !== note.id));
    }

    const targetFolder =
      targetFolderId === defaultFolder.id
        ? defaultFolder
        : findFolderById(rootFolder.root, targetFolderId);
    if (!targetFolder) return;

    // Remove note from current folder
    if (!isDefaultFolder && !isTrashFolder && folder?.notes) {
      folder.notes = folder.notes.filter((id: string) => id !== note.id);
    }

    // Add note to target folder
    targetFolder.notes = targetFolder.notes || [];
    if (!targetFolder.notes.includes(note.id)) {
      targetFolder.notes.push(note.id);
    }

    // Update state immediately
    setRootFolder({ ...rootFolder });

    // Update URL to reflect new location
    navigate(`/folder/${targetFolderId}/${note.id}`);

    // Persist to Supabase
    if (isTrashFolder) {
      // restore note
      restoreNote(note.id);
    }
    updateFolder(userId, rootFolder.root);
  }

  useEffect(() => {
    if (!note && folderNotes.length > 0) {
      navigate(`/folder/${folderId}/${folderNotes[0].id}`);
    }
  }, [note, folderNotes, folderId, navigate]);
  useEffect(() => {
    if (!folder && rootFolder.root.folders.length > 0) {
      navigate(`/folder/${rootFolder.root.folders[0].id}/welcome`);
    }
  }, [folder, rootFolder, navigate]);
  useEffect(() => {
    if (folder && folderNotes.length < 1) {
      navigate(`/folder/${folderId}/welcome`);
    }
  }, [folder, note, folderNotes, folderId, navigate]);
  useEffect(() => {
    async function getOrCreateRootFolder() {
      let rootFolderRow = await getRootFolder(userId);
      if (!rootFolderRow) {
        rootFolderRow = await initRootFolder(userId);
      }
      return rootFolderRow;
    }
    async function fetchData() {
      const [rootFolderRow, allNotes] = await Promise.all([
        getOrCreateRootFolder(),
        getAllNotes(userId),
      ]);

      setRootFolder(rootFolderRow);
      setNotes(allNotes.filter((note) => note.deleted_at === null));
      setDeletedNotes(allNotes.filter((note) => note.deleted_at !== null));
      setInitialized(true);
    }
    fetchData();
  }, [userId]);

  if (!initialized) return <Spinner />;

  async function onFolderDeleteClick(folderId: string) {
    const parent = findParentFolder(rootFolder.root, folderId);
    if (!parent) throw new Error("Parent folder not found");
    const folder = parent.folders.find((f: any) => f.id === folderId);
    if (!folder) throw new Error("Folder not found");
    parent.folders = parent.folders.filter((f: any) => f.id !== folderId);

    const noteIdsToDelete = folder.notes ?? [];
    const notesToDelete = noteIdsToDelete.map((n: any) => {
      const note = notes.find((_n) => _n.id === n);
      if (note) {
        note.deleted_at = new Date().toISOString();
      }
      return note;
    });

    setNotes(notes.filter((n: any) => !noteIdsToDelete.includes(n.id)));
    setDeletedNotes([...deletedNotes, ...notesToDelete]);

    setRootFolder({ ...rootFolder });
    updateFolder(userId, rootFolder.root);
    deleteNotes(noteIdsToDelete);
  }

  return (
    <NoteApp
      isTrashFolder={isTrashFolder}
      trashFolder={trashFolder}
      defaultFolder={defaultFolder}
      email={user.email ?? ""}
      onFolderDeleteClick={onFolderDeleteClick}
      onFolderRenameClick={async (id: string, newName: string) => {
        if (!rootFolder?.root) return;
        
        // Don't allow renaming default or trash folders
        if (id === 'default' || id === 'trash') return;
        
        // Validate input
        if (!newName.trim()) {
          console.error('Folder name cannot be empty');
          return;
        }

        const targetFolder = findFolderById(rootFolder.root, id);
        if (!targetFolder) {
          console.error('Folder not found');
          return;
        }

        // Update folder name
        targetFolder.name = newName;
        
        // Update state immediately
        setRootFolder({ ...rootFolder });
        
        // Persist to Supabase
        await updateFolder(userId, rootFolder.root);
      }}
      note={note}
      folder={folder}
      notes={folderNotes.sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )}
      folders={rootFolder.root.folders}
      userDisplayName={user.email ?? ""}
      createFolder={createFolder}
      onLogout={() => {
        navigate("/logout");
      }}
      updateNoteTitle={async (title: string) => {
        if (!noteId) return;
        note.title = title;
        setNotes([...notes]);
        await updateNoteTitle(noteId, title);
      }}
      onDeleteNote={onDeleteNote}
      onAddNote={onAddNote}
      onNoteChange={async (content: string) => {
        if (!noteId) return;
        note.content = content;
        setNotes([...notes]);
        await updateNoteContent(noteId, content);
      }}
      resetPassword={async (password: string) => {
        if (!user?.email) return;
        await supabase.auth.updateUser({ password });
      }}
      onMoveNoteToFolder={onMoveNoteToFolder}
    />
  );
};
