import "./NoteList.css";
import React from "react";
import { Link } from "react-router-dom";
import { extractText, formatDateTime } from "purenote-core";

const defaultNoteTitle = "Untitled";

const NoteNav = ({
  note,
  isActive,
  folderId,
}: {
  note: any;
  isActive: boolean;
  folderId: string;
}) => {
  const text = note.content ? ": " + extractText(note.content, 200) : "";
  return (
    <Link
      className={`list-group-item list-group-item-action my-2 rounded-1 ${
        isActive ? "active" : ""
      }`}
      to={`/folder/${folderId}/${note.id}`}
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
  folderId,
}: {
  activeId: string;
  notes: any[];
  folderId: string;
}) => {
  return (
    <div className="notes-list list-group px-2" style={{ overflow: "visible" }}>
      {notes.map((note) => (
        <NoteNav
          key={note.id}
          note={note}
          isActive={note.id === activeId}
          folderId={folderId}
        />
      ))}
    </div>
  );
};
