import { useNavigate, useParams } from "react-router-dom";
import Editor from "./Editor";
import { useEffect } from "react";
import { getNote, updateNote } from "../websocket";
import { store } from "../store";
import { useSelector } from "react-redux";
import { buildTree } from "../utils";
import Spinner from "./Spinner";
import { DateTime } from "luxon";
import { setNotes } from "../slices/notes";

// import TitleEditor from "./TitleEditor";

const NoteInner = ({ id, note }) => {
  function onChange(editorStateJSON) {
    store.dispatch(setNotes({ ...note, updatedAt: new Date().toISOString() }));
    updateNote(id, JSON.stringify(editorStateJSON));
  }
  const updatedAt = DateTime.fromISO(note.updatedAt);
  return (
    <Editor
      onChange={onChange}
      initialEditorStateJSONString={note.content ? note.content : null}
      autoFocus={false}
      id={id}
      initTitle={note.title}
      updatedAt={updatedAt.toFormat("HH:mm")}
    />
  );
};

const Note = () => {
  const { id } = useParams();
  const notes = useSelector((state) => state.notes);
  const note = notes[id];
  const folders = useSelector((state) => state.folders);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      const fetchedNote = await getNote(id);

      if (fetchedNote === null) {
        navigate("/");
      }
      store.dispatch(setNotes(fetchedNote));
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

  if (!note || !id) return <Spinner />;
  return <NoteInner key={id} id={id} note={note} />;
};

export default Note;
