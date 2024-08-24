import { useNavigate, useParams } from "react-router-dom";
import Editor from "./Editor";
import { useCallback, useEffect } from "react";
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

const Note = ({ showFolderListNav }) => {
  const { id } = useParams();
  if (!id) throw new Error("Note id is required");
  const notes = useSelector((state) => state.notes);
  const note = notes[id];
  const folders = useSelector((state) => state.folders);
  const navigate = useNavigate();

  const onChange = useCallback(
    (editorStateJSON) => {
      const content = JSON.stringify(editorStateJSON);
      store.dispatch(
        setNotes({
          ...note,
          file: { ...note.file, content },
          updatedAt: new Date().toISOString(),
        })
      );
      updateNoteFile(id, content);
    },
    [id, note]
  );

  const fetchNote = useCallback(async () => {
    const note = await getNote(id);
    store.dispatch(setNotes(documentSnapshotToJSON(note)));
  }, [id]);

  const navigateToFirstNote = useCallback(() => {
    if (folders.length > 0) {
      const first = folders[0];
      navigate(`/note/${first.id}`);
    }
  }, [folders, navigate]);

  useEffect(() => {
    if (id) fetchNote();
  }, [id, fetchNote]);
  useEffect(() => {
    if (!id) navigateToFirstNote();
  }, [id, navigateToFirstNote]);

  if (!note || !id) return <Spinner />;
  return (
    <Editor
      showFolderListNav={showFolderListNav}
      onChange={onChange}
      initialEditorStateJSONString={
        note.file?.content ? note.file.content : null
      }
      autoFocus={false}
      key={id}
      id={id}
      initTitle={note.name}
      updatedAt={formatDateTime(note.updatedAt)}
    />
  );
};

export default Note;
