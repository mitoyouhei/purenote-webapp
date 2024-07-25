import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HiMiniPlus } from "react-icons/hi2";
import { addNote, deleteFolder } from "../websocket";
import { buildTree } from "../utils";

const defaultNoteTitle = "Untitled";

const NavItem = ({ folder, isActive }) => {
  const navigate = useNavigate();

  const handleDeleteFolder = async (id) => {
    await deleteFolder(id);
    navigate("/");
  };
  return (
    <Link
      className={`list-group-item list-group-item-action ${
        isActive ? "active" : ""
      }`}
      to={`/note/${folder._id}`}
    >
      {/* <Link to={`/note/${folder._id}`} className="btn btn-primary">
      
    </Link> */}
      {folder.name ? folder.name : defaultNoteTitle}
      {/* <button
        className="btn btn-danger btn-sm float-end"
        onClick={() => handleDeleteFolder(folder._id)}
      >
        Delete
      </button> */}
    </Link>
  );
};

const Sidebar = () => {
  const folders = useSelector((state) => state.folders);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleAddNote = async () => {
    const { folder } = await addNote("", null);
    navigate(`/note/${folder._id}`);
  };

  const roots = buildTree(folders);
  const root = roots.length > 0 ? roots[0] : { children: [] };
  const isOnlyNote = root?.children.length === 1;
  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand">Notes</span>
          <div className="d-flex">sdf</div>
        </div>
      </nav>
      <div className="list-group">
        {root.children.map((folder) => (
          <NavItem
            key={folder._id}
            folder={folder}
            isActive={folder._id === id}
          />
        ))}
      </div>
      <div className="mt-3">
        <button className="btn btn-primary mt-2" onClick={handleAddNote}>
          <HiMiniPlus />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
