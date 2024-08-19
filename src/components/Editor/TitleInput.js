import React, { useEffect, useRef, useState } from "react";
import { store } from "../../store";
import { setNotes } from "../../slices/notes";
import { useSelector } from "react-redux";
import { updateNoteTitle } from "../../firebase/Collection";

const defaultNoteTitle = "Untitled";

const TitleInput = ({ id, initTitle }) => {
  const [title, setTitle] = useState(initTitle ?? "");
  const inputRef = useRef(null);
  const notes = useSelector((state) => state.notes);
  const note = notes[id];

  useEffect(() => {
    if (inputRef.current && !initTitle) {
      inputRef.current.focus();
    }
  }, [initTitle]);

  function onTitleChange(e) {
    setTitle(e.target.value);

    store.dispatch(
      setNotes({
        ...note,
        updatedAt: new Date().toISOString(),
        name: e.target.value,
      })
    );
    updateNoteTitle(id, e.target.value);
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
