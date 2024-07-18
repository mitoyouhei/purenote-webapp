// src/components/Note.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addNote } from "../actions";
import socket from "../websocket";

const Note = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const note = { content, folder_id: selectedFolder };
    dispatch(addNote(content, selectedFolder));
    setContent("");
    socket.send(JSON.stringify(note)); // 通过 WebSocket 发送数据
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <h1>id: {id}</h1>
        <label htmlFor="folderSelect">Folder</label>
        <select
          id="folderSelect"
          className="form-control"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          <option value="">Select Folder</option>
          {folders.map((folder) => (
            <option key={folder._id} value={folder._id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="noteContent">Note</label>
        <input
          type="text"
          className="form-control"
          id="noteContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary mt-2">
        Add Note
      </button>
    </form>
  );
};

export default Note;
