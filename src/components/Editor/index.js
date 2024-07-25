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
import { useEffect } from "react";
// import ToolbarPlugin from "./plugins/ToolbarPlugin";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";

const placeholder = "Enter some rich text...";
const defaultEmptyText = "";

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
export default function Editor({
  onChange,
  initialEditorStateJSON,
  autoFocus,
}) {
  //   const [editorState, setEditorState] = useState(null);

  const editorConfig = {
    // editorState,
    // editorState: initialEditorStateJSON,
    nodes: [],
    // Handling of errors during update
    onError(error) {
      throw error;
    },
    // The editor theme
    theme,
    editorState: (editor) => {
      editor.update(() => {
        const createEmtpyNode = (root) => {
          const paragraphNode = $createParagraphNode();
          const textNode = $createTextNode(defaultEmptyText);
          paragraphNode.append(textNode);
          root.append(paragraphNode);
        };
        if (initialEditorStateJSON) {
          try {
            const editorState = editor.parseEditorState(initialEditorStateJSON);
            const root = editorState.read(() => $getRoot());
            if (root.getChildren().length === 0) {
              createEmtpyNode(root);
            }
            editor.setEditorState(editorState);
          } catch (error) {
            console.error("Failed to load editor state from JSON", error);
          }
        } else {
          const root = $getRoot();
          if (root.getChildren().length === 0) {
            createEmtpyNode(root);
          }
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
        {/* <ToolbarPlugin /> */}
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
