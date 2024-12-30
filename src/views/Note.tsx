import React, { useEffect, useState } from "react";

// import { AppLayout } from "../components/AppLayout/AppLayout";
import NoteApp from "../components/NoteApp";
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
} from "../supabase";
import { setNoteSiderbarWidth } from "../slices/client";
import { useDispatch } from "react-redux";

async function getNotes(userId: string) {
  const { data } = await supabase
    .from("notes")
    .select()
    .order("updated_at", { ascending: false })
    .eq("user_id", userId);
  return data ?? [];
}

export const Note: React.FC = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState<any[]>([]);
  const client = useSelector((state: RootState) => state.client);
  const user = useSelector((state: RootState) => state.user) as User | null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    getNotes(user?.id ?? "").then(setNotes);
  }, [user]);

  return (
    <NoteApp
      note={note}
      notes={notes}
      initSiderbarWidth={client.noteSiderbarWidth}
      userDisplayName={user ? user.email ?? "" : ""}
      onLogout={() => {
        navigate("/logout");
      }}
      updateNoteTitle={async (title: string) => {
        if (!id) return;
        note.title = title;
        setNotes([...notes]);
        await updateNoteTitle(id, title);
      }}
      onAddNote={onAddNote}
      onSidebarWidthChange={onSidebarWidthChange}
      onNoteChange={async (content: string) => {
        if (!id) return;
        note.content = content;
        setNotes([...notes]);
        await updateNoteContent(id, content);
      }}
    />
  );

  // return (
  //   <AppLayout
  //     topbar={<span>topbar</span>}
  //     firstNav={<span>firstNav</span>}
  //     secondNav={<span>secondNav</span>}
  //     main={<span>main</span>}
  //   />
  // );
};
