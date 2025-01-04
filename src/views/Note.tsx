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
} from "../supabase";
import Spinner from "../components/Spinner";
import { getNotes, getRootFolder, findFolderById } from "../supabase";

function findUncontainedNotes(folder: any, notesList: any[]) {
  const containedNoteIds = new Set();

  // 收集所有 folder 中的 notes
  function collectNotes(folder: any) {
    if (folder.notes) {
      folder.notes.forEach((noteId: any) => containedNoteIds.add(noteId));
    }
    if (Array.isArray(folder.folders)) {
      folder.folders.forEach(collectNotes);
    }
  }

  collectNotes(folder);

  // 找出未包含的 notes
  return notesList.filter((note) => !containedNoteIds.has(note.id));
}

export const Note = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const userId = user.id;
  const { folderId, noteId } = useParams();

  const [notes, setNotes] = useState<any[]>([]);
  const [rootFolder, setRootFolder] = useState<any>({
    root: { folders: [] },
  });
  const [fetching, setFetching] = useState(false);

  const folder = findFolderById(rootFolder.root, folderId);
  const folderNotes = useMemo(() => {
    return folder?.notes
      ? folder.notes.map((noteId: any) =>
          notes.find((note: any) => note.id === noteId)
        )
      : folder?.id === "default"
      ? findUncontainedNotes(rootFolder.root, notes)
      : [];
  }, [folder, notes, rootFolder.root]);
  const note = folderNotes.find((note: any) => note.id === noteId);

  async function onAddNote() {
    if (!folderId) throw new Error("folderId is required");

    const [newNote, newRootFolder] = await createNote(folderId, rootFolder);

    setNotes([newNote, ...notes]);
    setRootFolder(newRootFolder);
    navigate(`/folder/${folderId}/${newNote.id}`);
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
    if (folder && !note && folderNotes.length < 1) {
      navigate(`/folder/${folderId}/welcome`);
    }
  }, [folder, note, folderNotes, folderId, navigate]);

  useEffect(() => {
    async function getOrCreateRootFolder() {
      let rootFolderRow = await getRootFolder(userId);
      if (!rootFolderRow) {
        rootFolderRow = await initRootFolder();
      }
      return rootFolderRow;
    }
    async function fetchData() {
      setFetching(true);
      const [rootFolderRow, notes] = await Promise.all([
        getOrCreateRootFolder(),
        getNotes(userId),
      ]);

      setRootFolder(rootFolderRow);
      setNotes(notes);
      setFetching(false);
    }
    fetchData();
  }, [userId]);

  async function createFolder(name: string) {
    const newFolder = { id: crypto.randomUUID(), name };
    const newRoot = {
      ...rootFolder,
      root: { folders: [...rootFolder.root.folders, newFolder] },
    };
    setRootFolder(newRoot);
    updateFolder(userId, newRoot.root);
  }

  if (fetching) return <Spinner />;
  return (
    <NoteApp
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
        if (!noteId) return;
        note.title = title;
        setNotes([...notes]);
        await updateNoteTitle(noteId, title);
      }}
      onDeleteNote={async () => {
        if (!noteId) return;
        const restNotes = notes.filter((note) => note.id !== noteId);
        const folder = findFolderByNoteId(rootFolder.root, noteId);
        if (folder) {
          folder.notes = folder.notes?.filter((id: string) => id !== noteId);
        }
        setRootFolder(rootFolder);
        setNotes(restNotes);
        if (restNotes.length > 0) {
          navigate(`/folder/${folderId}/${restNotes[0].id}`);
        } else {
          navigate(`/folder/${folderId}/welcome`);
        }
        await deleteNote(noteId);
        await updateFolder(rootFolder.user_id, rootFolder.root);
      }}
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
    />
  );
};
