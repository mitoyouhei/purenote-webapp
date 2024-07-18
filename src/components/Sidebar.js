// src/components/Sidebar.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addNote, deleteFolder } from "../websocket";

function buildTree(folders) {
  const map = new Map();
  const roots = [];

  // 首先创建一个 map，其中键是 folder 的 id，值是 folder 自身
  folders.forEach((folder) => {
    map.set(folder._id, { ...folder, children: [] });
  });

  folders.forEach((folder) => {
    if (folder.parentId === null) {
      // 如果 folder 没有 parentId，则它是一个根节点
      roots.push(map.get(folder._id));
    } else {
      // 否则，将其添加到其父节点的 children 数组中
      const parent = map.get(folder.parentId);
      if (parent) {
        parent.children.push(map.get(folder._id));
      }
    }
  });
  console.log(roots);
  return roots;
}

const Sidebar = () => {
  const [folderName, setFolderName] = useState("");
  const folders = useSelector((state) => state.folders);

  const handleAddNote = () => {
    addNote(folderName, null);
    setFolderName("");
  };

  const handleDeleteFolder = (id) => {
    deleteFolder(id);
  };

  const roots = buildTree(folders);
  const root = roots.length > 0 ? roots[0] : { children: [] };
  return (
    <>
      <h2>Notes</h2>
      <ul className="list-group">
        {root.children.map((folder) => (
          <li key={folder._id} className="list-group-item">
            <Link to={`/note/${folder._id}`} className="btn btn-primary">
              {folder.name}
            </Link>

            <button
              className="btn btn-danger btn-sm float-end"
              onClick={() => handleDeleteFolder(folder._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <input
          type="text"
          className="form-control"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="New note name"
        />
        <button className="btn btn-primary mt-2" onClick={handleAddNote}>
          Add Note
        </button>
      </div>
    </>
  );
};

export default Sidebar;
