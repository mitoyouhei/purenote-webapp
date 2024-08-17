import { useNavigate, useParams } from "react-router-dom";
import Editor from "./Editor";
import { useEffect } from "react";
import { store } from "../store";
import { useSelector } from "react-redux";
import { formatDateTime } from "../utils";
import Spinner from "./Spinner";
import { setNotes } from "../slices/notes";
import {
  documentSnapshotToJSON,
  getNote,
  updateNoteFile,
} from "../firebase/Collection";

// import TitleEditor from "./TitleEditor";

const NoteInner = ({ id, note, showFolderListNav }) => {
  function onChange(editorStateJSON) {
    const content = JSON.stringify(editorStateJSON);
    store.dispatch(
      setNotes({
        ...note,
        file: { ...note.file, content },
        updatedAt: new Date().toISOString(),
      })
    );
    updateNoteFile(id, content);
  }
  return (
    <Editor
      showFolderListNav={showFolderListNav}
      onChange={onChange}
      initialEditorStateJSONString={
        note.file?.content ? note.file.content : null
      }
      autoFocus={false}
      id={id}
      initTitle={note.name}
      updatedAt={formatDateTime(note.updatedAt)}
    />
  );
};

const Note = ({ showFolderListNav }) => {
  const { id } = useParams();
  if (!id) throw new Error("Note id is required");
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
      const note = await getNote(id);
      store.dispatch(setNotes(documentSnapshotToJSON(note)));
    };
    if (id) fetchNote();
  }, [id, navigate]);

  useEffect(() => {
    const navigateToFirstNote = () => {
      if (folders.length > 0) {
        const first = folders[0];
        navigate(`/note/${first.id}`);
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
