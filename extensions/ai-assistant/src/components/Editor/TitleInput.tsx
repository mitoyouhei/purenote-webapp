import React, { useEffect, useRef, useState } from "react";
import { store } from "../../store";
import { setNotes } from "../../slices/notes";
import { useSelector } from "react-redux";

const defaultNoteTitle = "Untitled";

const TitleInput = ({
  id,
  initTitle,
  updateTitle,
}: {
  id: string;
  initTitle: string;
  updateTitle: (title: string) => Promise<void>;
}) => {
  const [title, setTitle] = useState(initTitle ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const notes = useSelector((state: any) => state.notes);
  const note = notes[id];

  useEffect(() => {
    if (inputRef.current && !initTitle) {
      inputRef.current.focus();
    }
  }, [initTitle]);

  function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);

    store.dispatch(
      setNotes({
        ...note,
        updatedAt: new Date().toISOString(),
        name: e.target.value,
      })
    );
    updateTitle(e.target.value);
  }

  return (
    <input
      ref={inputRef}
      className="input-title"
      type="text"
      value={title}
      onChange={onTitleChange}
      placeholder={defaultNoteTitle}
    />
  );
};

export default TitleInput;
