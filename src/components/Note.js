import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { useEffect } from "react";
import { getNote, updateNote } from "../websocket";
import { setNote } from "../slices/note";
import { store } from "../store";
import { useSelector } from "react-redux";

const Note = () => {
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
    fetchNote();
  }, [id]);

  function onChange(editorStateJSON) {
    updateNote(id, JSON.stringify(editorStateJSON));
  }

  if (!note) return "loading";
  return (
    <form key={id} onSubmit={handleSubmit}>
      <h1>{note.title}</h1>
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
