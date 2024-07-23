import React, { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";

const defaultNoteTitle = "Untitled";
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
const NoNewLinePlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeNewLine = (event) => {
      event.preventDefault();
    };

    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        removeNewLine(event);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
};

const TitleEditor = ({ onChange, initialEditorStateJSON }) => {
  const initialConfig = {
    namespace: "MyEditor",
    editorState: initialEditorStateJSON,
    theme: {
      // 自定义主题配置（如果有需要）
    },
    onError: (error) => {
      console.error(error);
    },
  };

  function onEditorStateChange(editorState) {
    const editorStateJSON = editorState.toJSON();
    console.log(editorStateJSON);
    onChange(editorStateJSON);
  }
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable className="editor" />}
        placeholder={
          <div className="title-editor-placeholder">{defaultNoteTitle}</div>
        }
      />
      <NoNewLinePlugin />
      <OnChangePlugin onChange={debounce(onEditorStateChange, 500)} />
    </LexicalComposer>
  );
};

export default TitleEditor;
