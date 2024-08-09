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

const NoteInner = ({ id, note, showFolderListNav }) => {
  function onChange(editorStateJSON) {
    const content = JSON.stringify(editorStateJSON);
    store.dispatch(
      setNotes({ ...note, content, updatedAt: new Date().toISOString() })
    );
    updateNote(id, content);
  }
  const updatedAt = DateTime.fromISO(note.updatedAt);
  return (
    <Editor
      showFolderListNav={showFolderListNav}
      onChange={onChange}
      initialEditorStateJSONString={note.content ? note.content : null}
      autoFocus={false}
      id={id}
      initTitle={note.title}
      updatedAt={updatedAt.toFormat("HH:mm")}
    />
  );
};

const Note = ({ showFolderListNav }) => {
  const { id } = useParams();
  const notes = useSelector((state) => state.notes);
  const note = notes[id];
  const folders = useSelector((state) => state.folders);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSaveShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        console.log("Save shortcut triggered");
      }
    };

    document.addEventListener("keydown", handleSaveShortcut);

    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, []);

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
  return (
    <NoteInner
      showFolderListNav={showFolderListNav}
      key={id}
      id={id}
      note={note}
    />
  );
};

export default Note;
