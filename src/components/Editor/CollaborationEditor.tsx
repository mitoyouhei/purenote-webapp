import React, { useCallback, useState } from "react";
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
import { OnTabPlugin } from "./plugins/OnTabPlugin";

import * as Y from "yjs";
import { FireProvider } from "../../y-fire";
import { Provider } from "@lexical/yjs";
import { firebase } from "../../firebase";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import TitleInput from "./TitleInput";
import Spinner from "../Spinner";
import { useSelector } from "react-redux";
import { Collection } from "../../firebase/Collection";

const placeholder = "Enter your thoughts here...";

interface BasicEditorProps {
  showFolderListNav: boolean;
  autoFocus: boolean;
  id: string;
  updatedAt: string;
  initTitle: string;
}
const editorConfig = {
  namespace: "CollaborationEditor",
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
  editorState: null,
};

function getDocFromMap(id: string, yjsDocMap: Map<string, Y.Doc>) {
  let doc = yjsDocMap.get(id);

  if (doc === undefined) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  } else {
    doc.load();
  }

  return doc;
}

function createFirebaseProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>,
  documentPath: string
) {
  const firebaseApp = firebase;
  const ydoc = getDocFromMap(id, yjsDocMap);

  return new FireProvider({
    firebaseApp,
    ydoc,
    path: documentPath,
    maxUpdatesThreshold: 10,
    maxWaitTime: 100,
    maxWaitFirestoreTime: 500,
  });
}
export default function CollaborationEditor({
  showFolderListNav,
  updatedAt,
  id,
  initTitle,
}: BasicEditorProps) {
  const user = useSelector((state: any) => state.user);
  const [saving, setSaving] = useState(false);
  const [collaborationReady, setCollaborationReady] = useState(false);
  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Y.Doc>) => {
      const provider = createFirebaseProvider(
        id,
        yjsDocMap,
        `${Collection.notes}/${id}`
      );
      (provider as any).connect = () => {};
      (provider as any).disconnect = () => {};

      provider.onReady = () => {
        setCollaborationReady(true);
      };
      provider.onSaving = (status: boolean) => {
        setSaving(status);
      };
      return provider as unknown as Provider;
    },
    []
  );

  const savingIndicator = saving ? (
    <div className="position-absolute top-0 right-0 py-1"> Saving...</div>
  ) : null;
  const editor = collaborationReady ? (
    <div className="editor-container position-relative h-100">
      <ToolbarPlugin showFolderListNav={showFolderListNav} />
      <div className="editor-status-info px-5 py-1 text-center position-relative">
        Last updated at: {updatedAt}
        {savingIndicator}
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
      </div>
    </div>
  ) : (
    <Spinner />
  );
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <CollaborationPlugin
        id={id}
        shouldBootstrap={false}
        providerFactory={providerFactory}
        username={user.email[0].toUpperCase()}
      />
      {editor}
    </LexicalComposer>
  );
}
