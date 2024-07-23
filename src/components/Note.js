import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { useEffect, useState } from "react";
import { getNote, updateNote, updateNoteTitle } from "../websocket";
import { setNote } from "../slices/note";
import { store } from "../store";
import { useSelector } from "react-redux";
// import TitleEditor from "./TitleEditor";
const defaultNoteTitle = "Untitled";
const Note = () => {
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const note = useSelector((state) => state.note);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchNote = async () => {
      store.dispatch(setNote(null));
      const note = await getNote(id);
      console.log(note);
      store.dispatch(setNote(note));
    };
    if (id) fetchNote();
  }, [id]);
  useEffect(() => {
    if (note) setTitle(note.title);
  }, [note]);

  function onChange(editorStateJSON) {
    updateNote(id, JSON.stringify(editorStateJSON));
  }
  // function onTitleChange(editorStateJSON) {
  //   updateNoteTitle(id, JSON.stringify(editorStateJSON));
  // }
  function onTitleChange(e) {
    setTitle(e.target.value);
    updateNoteTitle(id, e.target.value);
  }

  if (!id) return "no id";
  if (!note) return "loading";
  return (
    <form key={id} onSubmit={handleSubmit}>
      <h1>
        <input
          className="input-title"
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder={defaultNoteTitle}
        />
      </h1>

      <div className="form-group">
        <Editor
          onChange={onChange}
          initialEditorStateJSON={note.content ? note.content : null}
        />
      </div>
    </form>
  );
};

export default Note;
