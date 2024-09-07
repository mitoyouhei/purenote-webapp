import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  LexicalEditor,
  RootNode,
} from "lexical";

const defaultEmptyText = "";

const createEmptyNode = (root: RootNode) => {
  const paragraphNode = $createParagraphNode();
  const textNode = $createTextNode(defaultEmptyText);
  paragraphNode.append(textNode);
  root.append(paragraphNode);
};
export const initializeEditorState = (
  editor: LexicalEditor,
  initialEditorStateJSON: string
) => {
  try {
    const editorState = editor.parseEditorState(initialEditorStateJSON);
    const root = editorState.read(() => $getRoot());
    if (root.getChildren().length === 0) {
      createEmptyNode(root);
    }
    editor.setEditorState(editorState);
  } catch (error) {
    console.error("Failed to load editor state from JSON", error);
  }
};
export const initializeEmptyEditorState = () => {
  const root = $getRoot();
  if (root.getChildren().length === 0) {
    createEmptyNode(root);
  }
};
