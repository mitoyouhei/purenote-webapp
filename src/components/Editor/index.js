import "./index.css";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";

import theme from "./theme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef, useState } from "react";
import ToolbarPlugin from "./ToolbarPlugin";
import { updateNoteTitle } from "../../websocket";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";

const placeholder = "Enter some rich text...";
const defaultEmptyText = "";
const defaultNoteTitle = "Untitled";

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

function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);

  return null;
}
function debounce(func, wait) {
  let timeout;

  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
const createEmptyNode = (root) => {
  const paragraphNode = $createParagraphNode();
  const textNode = $createTextNode(defaultEmptyText);
  paragraphNode.append(textNode);
  root.append(paragraphNode);
};

const initializeEditorState = (editor, initialEditorStateJSON) => {
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

const initializeEmptyEditorState = () => {
  const root = $getRoot();
  if (root.getChildren().length === 0) {
    createEmptyNode(root);
  }
};
export default function Editor({
  onChange,
  initialEditorStateJSON,
  autoFocus,
  id,
  initTitle,
}) {
  const editorConfig = {
    nodes: [],
    onError(error) {
      throw error;
    },
    theme,
    editorState: (editor) => {
      editor.update(() => {
        if (initialEditorStateJSON) {
          initializeEditorState(editor, initialEditorStateJSON);
        } else {
          initializeEmptyEditorState();
        }
      });
    },
  };

  function onEditorStateChange(editorState) {
    const editorStateJSON = editorState.toJSON();
    // console.log(JSON.stringify(editorStateJSON));
    onChange(editorStateJSON);
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container form-control">
        <ToolbarPlugin />
        <h1>
          <TitleInput id={id} initTitle={initTitle} />
        </h1>

        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          {autoFocus ? <AutoFocusPlugin /> : null}
          <OnChangePlugin onChange={debounce(onEditorStateChange, 300)} />
          {/* <TreeViewPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  );
}
