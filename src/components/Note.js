import { useNavigate, useParams } from "react-router-dom";
import Editor from "./Editor";
import { useEffect } from "react";
import { getNote, updateNote } from "../websocket";
import { setNote } from "../slices/note";
import { store } from "../store";
import { useSelector } from "react-redux";
import { buildTree } from "../utils";
import Spinner from "./Spinner";

// import TitleEditor from "./TitleEditor";

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
    <Editor
      onChange={onChange}
      initialEditorStateJSON={note.content ? note.content : null}
      autoFocus={false}
      id={id}
      initTitle={note.title}
    />
  );
};

export default Note;
