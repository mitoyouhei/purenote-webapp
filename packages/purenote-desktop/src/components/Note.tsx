import React from "react";
import { BasicEditor } from "./Editor";

import { formatDateTime } from "purenote-core";

const Note = ({
  showFolderListNav,
  id,
  note,
  onChange,
  updateNoteTitle,
}: {
  showFolderListNav: boolean;
  id: string;
  note: any;
  onChange: (content: string) => Promise<void>;
  updateNoteTitle: (title: string) => Promise<void>;
}) => {
  return (
    <BasicEditor
      showFolderListNav={showFolderListNav}
      onChange={(editorStateJSON: object) => {
        const content = JSON.stringify(editorStateJSON);
        return onChange(content);
      }}
      initialEditorStateJSONString={note.content}
      autoFocus={false}
      key={id}
      id={id}
      initTitle={note.title}
      updateNoteTitle={updateNoteTitle}
      updatedAt={formatDateTime(note.updated_at)}
    />
  );

  // return EditorBuilder.build(FileType.note, {
  //   id,
  //   note,
  //   onChange: (editorStateJSON: object) => {
  //     const content = JSON.stringify(editorStateJSON);
  //     return onChange(content);
  //   },
  //   showFolderListNav,
  //   updateNoteTitle,
  // });
  // const notes = useSelector((state) => state.notes);
  // const note = notes[id];
  // const folders = useSelector((state) => state.folders);
  // const navigate = useNavigate();

  // const onChange = useCallback(
  //   (editorStateJSON) => {
  //     const content = JSON.stringify(editorStateJSON);
  //     store.dispatch(
  //       setNotes({
  //         ...note,
  //         file: { ...note.file, content },
  //         updatedAt: new Date().toISOString(),
  //       })
  //     );
  //     return updateNoteFile(id, content);
  //   },
  //   [id, note]
  // );

  // const fetchNote = useCallback(async () => {
  //   const note = await getNote(id);
  //   store.dispatch(setNotes(documentSnapshotToJSON(note)));
  // }, [id]);

  // const navigateToFirstNote = useCallback(() => {
  //   if (folders.length > 0) {
  //     const first = folders[0];
  //     navigate(`/note/${first.id}`);
  //   }
  // }, [folders, navigate]);

  // useEffect(() => {
  //   if (id) fetchNote();
  // }, [id, fetchNote]);
  // useEffect(() => {
  //   if (!id) navigateToFirstNote();
  // }, [id, navigateToFirstNote]);

  // if (!note || !id) return <Spinner />;
};

export default Note;
