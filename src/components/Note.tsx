import React from "react";
import { BasicEditor, CollaborationEditor } from "./Editor";
import { FileType } from "../firebase/Collection";
import { formatDateTime } from "../utils";
import QuillEditor from "./Editor/QuillEditor";

const EditorBuilder = {
  [FileType.note]: ({
    id,
    note,
    onChange,
    showFolderListNav,
  }: {
    id: string;
    note: any;
    onChange: (content: object) => Promise<void>;
    showFolderListNav: boolean;
  }) => (
    <BasicEditor
      showFolderListNav={showFolderListNav}
      onChange={onChange}
      initialEditorStateJSONString={note.content}
      autoFocus={false}
      key={id}
      id={id}
      initTitle={note.name}
      updatedAt={formatDateTime(note.updatedAt)}
    />
  ),

  [FileType.collabNote]: ({
    id,
    note,
    showFolderListNav,
  }: {
    id: string;
    note: any;
    showFolderListNav: boolean;
  }) => (
    <CollaborationEditor
      id={id}
      autoFocus={false}
      key={id}
      showFolderListNav={showFolderListNav}
      initTitle={note.name}
      updatedAt={formatDateTime(note.updatedAt)}
    />
  ),
  [FileType.quillNote]: () => <QuillEditor />,

  build(type: FileType, props: any) {
    const builder = this[type] || this[FileType.note];

    return builder(props);
  },
};

const Note = ({
  showFolderListNav,
  id,
  note,
  onChange,
}: {
  showFolderListNav: boolean;
  id: string;
  note: any;
  onChange: (content: string) => Promise<void>;
}) => {
  return EditorBuilder.build(FileType.note, {
    id,
    note,
    onChange: (editorStateJSON: object) => {
      const content = JSON.stringify(editorStateJSON);
      return onChange(content);
    },
    showFolderListNav,
  });
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
