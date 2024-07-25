import { useNavigate, useParams } from "react-router-dom";
import Editor from "./Editor";
import { useEffect, useRef, useState } from "react";
import { getNote, updateNote, updateNoteTitle } from "../websocket";
import { setNote } from "../slices/note";
import { store } from "../store";
import { useSelector } from "react-redux";
import { buildTree } from "../utils";
import Spinner from "./Spinner";

// import TitleEditor from "./TitleEditor";

const TitleInput = ({ id, initTitle }) => {
  const [title, setTitle] = useState(initTitle ?? "");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !initTitle) {
      inputRef.current.focus();
    }
  }, [initTitle]);

  function onTitleChange(e) {
    setTitle(e.target.value);
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

const defaultNoteTitle = "Untitled";
const Note = () => {
  const { id } = useParams();
  const note = useSelector((state) => state.note);
  const folders = useSelector((state) => state.folders);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      store.dispatch(setNote(null));
      const note = await getNote(id);
      // console.log("🚀 ~ fetchNote ~ note:", note);
      if (note === null) {
        navigate("/");
      }
      store.dispatch(setNote(note));
    };
    if (id) fetchNote();
  }, [id, navigate]);

  useEffect(() => {
    const navigateToFirstNote = () => {
      const roots = buildTree(folders);
      const root = roots.length > 0 ? roots[0] : { children: [] };
      if (root?.children?.length > 0) {
        const first = root.children[0];
        navigate(`/note/${first._id}`);
      }
    };
    if (!id) {
      navigateToFirstNote();
    }
  }, [id, folders, navigate]);

  function onChange(editorStateJSON) {
    updateNote(id, JSON.stringify(editorStateJSON));
  }
  if (!note || !id) return <Spinner />;

  return (
    <>
      <h1>
        <TitleInput id={id} initTitle={note.title} />
      </h1>

      <Editor
        onChange={onChange}
        initialEditorStateJSON={note.content ? note.content : null}
        autoFocus={!!note.title}
      />
    </>
  );
};

export default Note;
