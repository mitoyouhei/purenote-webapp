import React, { useEffect, useState } from "react";

// import { AppLayout } from "../components/AppLayout/AppLayout";
import NoteApp from "../components/NoteApp";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase, createNote } from "../supabase";
import { setNoteSiderbarWidth } from "../slices/client";
import { useDispatch } from "react-redux";

export const Note: React.FC = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState<any[]>([]);
  const client = useSelector((state: RootState) => state.client);
  const user = useSelector((state: RootState) => state.user) as User | null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function onAddNote() {
    const newNote = await createNote();
    if (newNote) {
      navigate(`/note/${newNote[0].id}`);
    }
  }
  function onSidebarWidthChange(width: number) {
    dispatch(setNoteSiderbarWidth(width));
  }

  async function onNoteChange(content: string) {
    // await updateNoteFile(id, content);
  }

  useEffect(() => {
    supabase
      .from("notes")
      .select()
      .eq("user_id", user?.id)
      .then(({ data, error }) => {
        setNotes(data ?? []);
      });
  }, [user]);

  return (
    <NoteApp
      note={notes.find((note) => note.id === id)}
      notes={notes}
      initSiderbarWidth={client.noteSiderbarWidth}
      userDisplayName={user ? user.email ?? "" : ""}
      onLogout={() => {
        navigate("/logout");
      }}
      onAddNote={onAddNote}
      onSidebarWidthChange={onSidebarWidthChange}
      onNoteChange={onNoteChange}
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
