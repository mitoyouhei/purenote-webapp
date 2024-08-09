import "./index.css";
import React, { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";

import theme from "./theme";
import ToolbarPlugin from "./ToolbarPlugin";
import { updateNoteTitle } from "../../websocket";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { globalErrorHandler } from "../../errorHandler";
import { store } from "../../store";
import { setNotes } from "../../slices/notes";
import { useSelector } from "react-redux";

const placeholder = "Enter some rich text...";
const defaultEmptyText = "";
const defaultNoteTitle = "Untitled";

const TitleInput = ({ id, initTitle }) => {
  const [title, setTitle] = useState(initTitle ?? "");
  const inputRef = useRef(null);
  const notes = useSelector((state) => state.notes);
  const note = notes[id];

  useEffect(() => {
    if (inputRef.current && !initTitle) {
      inputRef.current.focus();
    }
  }, [initTitle]);

  function onTitleChange(e) {
    setTitle(e.target.value);

    store.dispatch(
      setNotes({
        ...note,
        updatedAt: new Date().toISOString(),
        title: e.target.value,
      })
    );
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

function OnTabPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Tab") {
        event.preventDefault();
        if (event.shiftKey) {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }
      }
    }

    const rootElement = editor.getRootElement();
    rootElement.addEventListener("keydown", handleKeyDown);

    return () => {
      rootElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  return null;
}
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
  showFolderListNav,
  onChange,
  initialEditorStateJSONString,
  autoFocus,
  id,
  updatedAt,
  initTitle,
}) {
  const editorConfig = {
    nodes: [HeadingNode, QuoteNode, ListItemNode, ListNode],
    onError(error) {
      globalErrorHandler(error);
      return <h1>Something went wrong.</h1>;
    },
    theme,
    editorState: (editor) => {
      editor.update(() => {
        if (initialEditorStateJSONString) {
          initializeEditorState(editor, initialEditorStateJSONString);
        } else {
          initializeEmptyEditorState();
        }
      });
    },
  };
  const previousEditorStateRef = useRef(
    JSON.parse(initialEditorStateJSONString)
  );

  function onEditorStateChange(editorState) {
    editorState.read(() => {
      const currentContent = editorState.toJSON();

      // check content changed or note
      if (previousEditorStateRef.current) {
        const previousContent = previousEditorStateRef.current;
        if (
          JSON.stringify(currentContent) === JSON.stringify(previousContent)
        ) {
          // content no change, nothing happen
          return;
        }
      }
      previousEditorStateRef.current = editorState.toJSON();
      onChange(currentContent);
    });
  }
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container position-relative h-100" style={{}}>
        <ToolbarPlugin showFolderListNav={showFolderListNav} />
        <div className="editor-status-info px-5 py-1 text-center">
          {updatedAt}
        </div>
        <div className="editor-inner px-5 pt-2">
          <h1>
            <TitleInput id={id} initTitle={initTitle} />
          </h1>
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
          <ListPlugin />
          <OnTabPlugin />
          {autoFocus ? <AutoFocusPlugin /> : null}
          <OnChangePlugin onChange={debounce(onEditorStateChange, 300)} />
          {/* <TreeViewPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  );
}
