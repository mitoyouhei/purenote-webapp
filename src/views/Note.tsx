import React, { useEffect, useState } from "react";

import { NoteApp } from "../components/NoteApp";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
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
} from "../supabase";
import { setNoteSiderbarWidth } from "../slices/client";
import { useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
async function getNotes(userId: string) {
  const { data } = await supabase
    .from("notes")
    .select()
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .eq("user_id", userId);
  return data ?? [];
}

async function getRootFolder(userId: string) {
  const { data } = await supabase
    .from("folders")
    .select()
    .is("deleted_at", null)
    .eq("user_id", userId);
  return data?.[0];
}

export const Note = ({ user }: { user: User }) => {
  const userId = user.id;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const client = useSelector((state: RootState) => state.client);
  const [notes, setNotes] = useState<any[]>([]);
  const [rootFolder, setRootFolder] = useState<any>({
    root: { folders: [] },
  });
  const [fetching, setFetching] = useState(false);

  const note = notes.find((note) => note.id === id);

  async function onAddNote() {
    const newNote = await createNote();
    setNotes([newNote, ...notes]);
    navigate(`/note/${newNote.id}`);
  }
  function onSidebarWidthChange(width: number) {
    dispatch(setNoteSiderbarWidth(width));
  }

  useEffect(() => {
    if (!note && notes.length > 0) {
      navigate(`/note/${notes[0].id}`);
    }
  }, [note, notes, navigate]);

  useEffect(() => {
    async function fetchData() {
      setFetching(true);
      let rootFolderRow = await getRootFolder(userId);
      if (!rootFolderRow) {
        rootFolderRow = await initRootFolder();
      }
      const notes = await getNotes(userId);

      setNotes(notes);
      setRootFolder(rootFolderRow);
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
      notes={notes}
      folders={rootFolder?.root?.folders ?? []}
      initSiderbarWidth={client.noteSiderbarWidth}
      userDisplayName={user.email ?? ""}
      createFolder={createFolder}
      onLogout={() => {
        navigate("/logout");
      }}
      updateNoteTitle={async (title: string) => {
        if (!id) return;
        note.title = title;
        setNotes([...notes]);
        await updateNoteTitle(id, title);
      }}
      onDeleteNote={async () => {
        if (!id) return;
        const restNotes = notes.filter((note) => note.id !== id);
        setNotes(restNotes);
        if (restNotes.length > 0) {
          navigate(`/note/${restNotes[0].id}`);
        } else {
          navigate("/note/welcome");
        }
        await deleteNote(id);
      }}
      onAddNote={onAddNote}
      onSidebarWidthChange={onSidebarWidthChange}
      onNoteChange={async (content: string) => {
        if (!id) return;
        note.content = content;
        setNotes([...notes]);
        await updateNoteContent(id, content);
      }}
      resetPassword={async (password: string) => {
        if (!user?.email) return;
        await supabase.auth.updateUser({ password });
      }}
    />
  );
};
