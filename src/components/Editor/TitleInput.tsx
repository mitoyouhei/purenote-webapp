import React, { useEffect, useRef, useState } from "react";
import { store } from "../../store";
import { setNotes } from "../../slices/notes";
import { useSelector } from "react-redux";
import { updateNoteTitle } from "../../firebase/Collection";
import { debounce } from "../../utils";

const defaultNoteTitle = "Untitled";

const saveTitle = debounce(updateNoteTitle, 200);

const TitleInput = ({ id, initTitle }: { id: string; initTitle: string }) => {
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
    saveTitle(id, e.target.value);
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
