import "./NoteList.css";
import React from "react";
import { Link } from "react-router-dom";
import { extractText, formatDateTime } from "../utils";

const defaultNoteTitle = "Untitled";

const NoteNav = ({ note, isActive }: { note: any; isActive: boolean }) => {
  const text = note.content ? ": " + extractText(note.content, 200) : "";
  return (
    <Link
      className={`list-group-item list-group-item-action my-2 rounded-1 ${
        isActive ? "active" : ""
      }`}
      to={`/note/${note.id}`}
    >
      <div className="title-row">
        {note.title ? note.title : defaultNoteTitle}
      </div>
      <small className="fw-lighter">
        {formatDateTime(note.updated_at)}
        {text}
      </small>
    </Link>
  );
};

export const NoteList = ({
  activeId,
  notes,
}: {
  activeId: string;
  notes: any[];
}) => {
  return (
    <div className="notes-list list-group px-2" style={{ overflow: "visible" }}>
      {notes.map((note) => (
        <NoteNav key={note.id} note={note} isActive={note.id === activeId} />
      ))}
    </div>
  );
};
