import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiMiniPlus } from "react-icons/hi2";
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

const defaultNoteTitle = "Untitled";

const Sidebar = () => {
  const folders = useSelector((state) => state.folders);

  const handleAddNote = () => {
    addNote("", null);
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
              {folder.name ? folder.name : defaultNoteTitle}
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
        <button className="btn btn-primary mt-2" onClick={handleAddNote}>
          <HiMiniPlus />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
