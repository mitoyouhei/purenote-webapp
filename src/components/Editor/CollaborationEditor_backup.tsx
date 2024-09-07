import React, { useCallback } from "react";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import * as Y from "yjs";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { FireProvider } from "y-fire";
import theme from "./theme";
import { Provider } from "@lexical/yjs";
import { firebase } from "../../firebase";

interface CollaborationEditorProps {
  id: string;
  showFolderListNav: boolean;
}

function getDocFromMap(id: string, yjsDocMap: Map<string, Y.Doc>) {
  let doc = yjsDocMap.get(id);

  if (doc === undefined) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  } else {
    doc.load();
  }
  doc.on("update", (event) => {
    console.log("!!!  update", new Date());
  });
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

const editorConfig = {
  // NOTE: This is critical for collaboration plugin to set editor state to null. It
  // would indicate that the editor should not try to set any default state
  // (not even empty one), and let collaboration plugin do it instead
  editorState: null,
  namespace: "React.js Collab Demo",
  nodes: [],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme,
};

export default function CollaborationEditor({
  id,
  showFolderListNav,
}: CollaborationEditorProps) {
  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Y.Doc>) => {
      const provider = createFirebaseProvider(id, yjsDocMap, `testyjs/${id}`);
      (provider as any).connect = () => {
        provider.reconnect();
      };
      (provider as any).disconnect = () => {
        provider.kill();
      };
      provider.onReady = () => {
        console.log("collaboration ready");
      };
      provider.onSaving = (status) => {
        console.log("collaboration saving", status);
      };
      //   const provider = createWebsocketProvider(id, yjsDocMap);
      return provider as unknown as Provider;
    },
    []
  );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container position-relative h-100">
        {/* <ToolbarPlugin showFolderListNav={showFolderListNav} /> */}
        <div className="editor-inner mx-5">
          <CollaborationPlugin
            id={id}
            shouldBootstrap={false}
            providerFactory={providerFactory}
          />
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}

// const editorConfig = {
//   namespace: "CollaborationEditor",
//   onError(error: Error) {
//     return <h1>Something went wrong.</h1>;
//   },
//   theme,
// };

// export default function CollaborationEditor({
//   id,
//   showFolderListNav,
// }: CollaborationEditorProps) {
//   const user = useSelector((state: any) => state.user);
//   const providerFactory = useCallback(
//     (id: string, yjsDocMap: Map<string, Y.Doc>) => {
//       //   const provider = createFirebaseProvider(id, yjsDocMap, `testyjs/${id}`);
//       //   (provider as any).connect = () => {
//       //     provider.reconnect();
//       //   };
//       //   (provider as any).disconnect = () => {
//       //     provider.kill();
//       //   };
//       //   provider.onReady = () => {
//       //     console.log("collaboration ready");
//       //     setCollaborationReady(true);
//       //   };
//       //   provider.onSaving = (status) => {
//       //     console.log("collaboration saving", status);
//       //   };
//       const provider = createWebsocketProvider(id, yjsDocMap);
//       return provider as unknown as Provider;
//     },
//     []
//   );

//   const username = user.email.split("@")[0];

//   return (
//     <LexicalComposer initialConfig={editorConfig}>
//       <div className="editor-container position-relative h-100">
//         {/* <ToolbarPlugin showFolderListNav={showFolderListNav} /> */}
//         <div className="editor-inner mx-5">
//           <CollaborationPlugin
//             id={id}
//             shouldBootstrap={false}
//             providerFactory={providerFactory}
//             username={
//               username.length <= 7 ? username : username.slice(0, 4) + "..."
//             }
//           />
//           <RichTextPlugin
//             contentEditable={<ContentEditable className="editor-input" />}
//             ErrorBoundary={LexicalErrorBoundary}
//           />
//         </div>
//       </div>
//     </LexicalComposer>
//   );
// }
