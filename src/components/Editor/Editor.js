import React, { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import theme from "./theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { globalErrorHandler } from "../../errorHandler";
import TitleInput from "./TitleInput";
import { debounce } from "../../utils";

const placeholder = "Enter some rich text...";
const defaultEmptyText = "";

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
    nodes: [
      HeadingNode,
      QuoteNode,
      ListItemNode,
      ListNode,
      HorizontalRuleNode,
      CodeNode,
      LinkNode,
    ],
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
      <div className="editor-container position-relative h-100">
        <ToolbarPlugin showFolderListNav={showFolderListNav} />
        <div className="editor-status-info px-5 py-1 text-center">
          Last updated at: {updatedAt}
        </div>
        <h1 className="mx-5">
          <TitleInput id={id} initTitle={initTitle} />
        </h1>
        <div className="editor-inner mx-5">
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
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
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
