import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OUTDENT_CONTENT_COMMAND, INDENT_CONTENT_COMMAND } from "lexical";
import { useEffect } from "react";

export function OnTabPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
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
    if (rootElement != null)
      rootElement.addEventListener("keydown", handleKeyDown);

    return () => {
      if (rootElement != null)
        rootElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  return null;
}
