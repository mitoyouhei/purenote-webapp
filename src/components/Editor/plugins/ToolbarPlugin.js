import React from "react";
import "./ToolbarPlugin.css";
import Dropdown from "react-bootstrap/Dropdown";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  insertList,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaArrowRotateLeft,
  FaArrowRotateRight,
  FaBold,
  FaItalic,
  FaList,
  FaListOl,
  FaQuoteLeft,
  // FaParagraph,
  FaA,
  FaStrikethrough,
  FaUnderline,
} from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

const FontMenuToggle = React.forwardRef(({ onClick }, ref) => (
  <button
    className={"toolbar-item spaced "}
    onClick={onClick}
    aria-label="Format Bold"
    ref={ref}
  >
    <FaA />
  </button>
));

const AlignMenuToggle = React.forwardRef(({ onClick }, ref) => (
  <button
    className={"toolbar-item spaced "}
    onClick={onClick}
    aria-label="Format Bold"
    ref={ref}
  >
    <FaAlignJustify />
  </button>
));

const ListMenuToggle = React.forwardRef(({ onClick }, ref) => (
  <button
    className={"toolbar-item spaced "}
    onClick={onClick}
    aria-label="Format Bold"
    ref={ref}
  >
    <FaList />
  </button>
));

export default function ToolbarPlugin({ showFolderListNav }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [isOl, setIsOl] = useState(false);
  const [isUl, setIsUl] = useState(false);
  const [headerIndex, setHeaderIndex] = useState(0);
  const [isQuote, setIsQuote] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const anchor = selection.anchor;
      const focus = selection.focus;
      const nodes = selection.getNodes();
      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return;
      }
      nodes.forEach((node) => {
        setIsQuote($isQuoteNode(node));
        setIsOl($isListNode(node) && node.getTag() === "ol");
        setIsUl($isListNode(node) && node.getTag() === "ul");
        setHeaderIndex(
          $isHeadingNode(node) ? parseInt(node.getTag().slice(1)) : 0
        );
      });
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          insertList(editor, "bullet");
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  const toggleQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const node = $getNodeByKey(elementKey);

        if ($isQuoteNode(node)) {
          return $setBlocksType(selection, () => $createParagraphNode());
        } else {
          return $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  };
  const toggleList = (command) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const node = $getNodeByKey(elementKey);

        if ($isListNode(node)) {
          if (
            node.getTag() === "ol" &&
            INSERT_ORDERED_LIST_COMMAND === command
          ) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else if (
            node.getTag() === "ul" &&
            INSERT_UNORDERED_LIST_COMMAND === command
          ) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(command, undefined);
          }
          // editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(command, undefined);
        }
      }
    });
  };
  const toggleHeading = (level) => {
    const targetHead = `h${level}`;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const node = $getNodeByKey(elementKey);
        if ($isHeadingNode(node) && node.getTag() === targetHead) {
          return $setBlocksType(selection, () => $createParagraphNode());
        } else {
          return $setBlocksType(selection, () =>
            $createHeadingNode(targetHead)
          );
        }
      }
    });
  };

  return (
    <div className="toolbar position-sticky top-0 z-1" ref={toolbarRef}>
      {showFolderListNav ? (
        <Link
          to="/folders"
          className="toolbar-item spaced active me-3"
          aria-label="Redo"
        >
          <IoMdArrowRoundBack />
        </Link>
      ) : null}
      <button
        style={{ display: "none" }}
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <FaArrowRotateLeft />
      </button>
      <button
        style={{ display: "none" }}
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Redo"
      >
        <FaArrowRotateRight />
      </button>
      <Divider />

      <Dropdown drop="down-centered">
        <Dropdown.Toggle as={FontMenuToggle} />

        <Dropdown.Menu className="toolbar-dropdown-menu" align={{ sm: "end" }}>
          <div className="d-flex toolbar-dropdown-row">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
              }}
              className={"toolbar-item spaced " + (isBold ? "active" : "")}
              aria-label="Format Bold"
            >
              <FaBold />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
              }}
              className={"toolbar-item spaced " + (isItalic ? "active" : "")}
              aria-label="Format Italics"
            >
              <FaItalic />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
              }}
              className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
              aria-label="Format Underline"
            >
              <FaUnderline />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
              }}
              className={
                "toolbar-item spaced " + (isStrikethrough ? "active" : "")
              }
              aria-label="Format Strikethrough"
            >
              <FaStrikethrough />
            </button>

            <button
              className={"toolbar-item spaced " + (isQuote ? "active" : "")}
              onClick={() => toggleQuote()}
            >
              <FaQuoteLeft />
            </button>
          </div>

          <Dropdown.Divider />

          <div className="d-flex toolbar-dropdown-row">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                className={
                  "toolbar-item spaced " +
                  (headerIndex === level ? "active" : "")
                }
                onClick={() => toggleHeading(level)}
              >
                H{level}
              </button>
            ))}
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop="down-centered">
        <Dropdown.Toggle as={ListMenuToggle} />

        <Dropdown.Menu className="toolbar-dropdown-menu" align={{ sm: "end" }}>
          <div className="d-flex toolbar-dropdown-row">
            <button
              onClick={() => {
                toggleList(INSERT_UNORDERED_LIST_COMMAND);
              }}
              className={"toolbar-item spaced " + (isUl ? "active" : "")}
              aria-label="Unordered List"
            >
              <FaList />
            </button>
            <button
              onClick={() => {
                toggleList(INSERT_ORDERED_LIST_COMMAND);
              }}
              className={"toolbar-item spaced " + (isOl ? "active" : "")}
              aria-label="Ordered List"
            >
              <FaListOl />
            </button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop="down-centered">
        <Dropdown.Toggle as={AlignMenuToggle} />

        <Dropdown.Menu className="toolbar-dropdown-menu" align={{ sm: "end" }}>
          <div className="d-flex toolbar-dropdown-row">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
              }}
              className="toolbar-item spaced"
              aria-label="Left Align"
            >
              <FaAlignLeft />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
              }}
              className="toolbar-item spaced"
              aria-label="Center Align"
            >
              <FaAlignCenter />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
              }}
              className="toolbar-item spaced"
              aria-label="Right Align"
            >
              <FaAlignRight />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
              }}
              className="toolbar-item spaced"
              aria-label="Justify Align"
            >
              <FaAlignJustify />
            </button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
