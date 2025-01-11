import React, { useRef, useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
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
import { OnTabPlugin } from "./plugins/OnTabPlugin";
import {
  initializeEditorState,
  initializeEmptyEditorState,
} from "./initializeEditorState";
import { EditorState, LexicalEditor } from "lexical";

const placeholder = "Enter your thoughts here...";

interface BasicEditorProps {
  showFolderListNav: boolean;
  onChange: (content: object) => Promise<void>;
  initialEditorStateJSONString: string;
  autoFocus: boolean;
  id: string;
  updatedAt: string;
  initTitle: string;
  updateNoteTitle: (title: string) => Promise<void>;
}

export default function BasicEditor({
  showFolderListNav,
  onChange,
  initialEditorStateJSONString,
  autoFocus,
  id,
  updatedAt,
  initTitle,
  updateNoteTitle,
}: BasicEditorProps) {
  const [saving, setSaving] = useState(false);
  const editorConfig = {
    namespace: "BasicEditor",
    nodes: [
      HeadingNode,
      QuoteNode,
      ListItemNode,
      ListNode,
      HorizontalRuleNode,
      CodeNode,
      LinkNode,
    ],
    onError(error: Error) {
      globalErrorHandler(error);
      return <h1>Something went wrong.</h1>;
    },
    theme,
    editorState: (editor: LexicalEditor) => {
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

  function onEditorStateChange(editorState: EditorState) {
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
      setSaving(true);
      onChange(currentContent).then(() => {
        setSaving(false);
      });
    });
  }
  const savingIndicator = saving ? (
    <div className="position-absolute top-0 right-0 py-1"> Saving...</div>
  ) : null;
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container position-relative h-100">
        <ToolbarPlugin showFolderListNav={showFolderListNav} />
        <div className="editor-status-info px-5 py-1 text-center position-relative">
          Last updated at: {updatedAt}
          {savingIndicator}
        </div>
        <h1 className="mx-5">
          <TitleInput
            id={id}
            initTitle={initTitle}
            updateTitle={async (title: string) => {
              setSaving(true);
              await updateNoteTitle(title);
              setSaving(false);
            }}
          />
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
