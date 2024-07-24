import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniPlus } from "react-icons/hi2";
import { addNote, deleteFolder } from "../websocket";
import { buildTree } from "../utils";

const defaultNoteTitle = "Untitled";

const Sidebar = () => {
  const folders = useSelector((state) => state.folders);
  const navigate = useNavigate();

  const handleAddNote = () => {
    addNote("", null);
  };

  const handleDeleteFolder = async (id) => {
    await deleteFolder(id);
    navigate("/");
  };

  const roots = buildTree(folders);
  const root = roots.length > 0 ? roots[0] : { children: [] };
  const isOnlyNote = root?.children.length === 1;
  return (
    <>
      <h2>Notes</h2>
      <ul className="list-group">
        {root.children.map((folder) => (
          <li key={folder._id} className="list-group-item">
            <Link to={`/note/${folder._id}`} className="btn btn-primary">
              {folder.name ? folder.name : defaultNoteTitle}
            </Link>
            {isOnlyNote ? null : (
              <button
                className="btn btn-danger btn-sm float-end"
                onClick={() => handleDeleteFolder(folder._id)}
              >
                Delete
              </button>
            )}
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
