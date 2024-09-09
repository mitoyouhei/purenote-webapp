import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HiMiniPlus, HiMiniUserCircle, HiTrash } from "react-icons/hi2";
import { formatDateTime } from "../utils";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { store } from "../store";
import {
  createEmptyNote,
  deleteNote,
  documentSnapshotToJSON,
  onMyFilesystemChange,
} from "../firebase/Collection";
import { setFolders } from "../slices/folders";
import Setting from "./Setting";
import Spinner from "./Spinner";

const defaultNoteTitle = "Untitled";

const UserMenuToggle = React.forwardRef(({ onClick }, ref) => (
  <span className="btn" onClick={onClick}>
    <HiMiniUserCircle />
  </span>
));

const NavItem = ({ folder, isActive }) => {
  return (
    <Link
      className={`list-group-item list-group-item-action my-2 border-1 rounded-1 ${
        isActive ? "active" : ""
      }`}
      to={`/note/${folder.id}`}
    >
      <div className="title-row">
        <b>{folder.name ? folder.name : defaultNoteTitle}</b>
      </div>
      <small className="fw-lighter" style={{ fontSize: ".675em" }}>
        {formatDateTime(folder.updatedAt)}
      </small>
    </Link>
  );
};

const Sidebar = () => {
  const [folderInitialized, setFolderInitialized] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const folders = useSelector((state) => state.folders);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { id } = useParams();

  const sortedFolders = folders.map((folder) => {
    return {
      ...folder,
      updatedAt: folder.updatedAt ?? new Date().toISOString(),
    };
  });
  const handleAddNote = async () => {
    const newNote = await createEmptyNote();
    navigate(`/note/${newNote.id}`);
  };

  const handleDeleteNote = async (e) => {
    e.preventDefault();

    if (sortedFolders.length === 0) {
      return;
    }
    if (sortedFolders.length === 1) {
      await deleteNote(id);
      navigate("/");
      return;
    }

    const currentNoteIndex = sortedFolders.findIndex(
      (folder) => folder.id === id
    );
    let nextNoteIndex = currentNoteIndex + 1;
    if (nextNoteIndex >= sortedFolders.length) {
      nextNoteIndex = 0;
    }

    const nextNote = sortedFolders[nextNoteIndex];

    navigate(`/note/${nextNote.id}`);
    await deleteNote(id);
  };

  useEffect(() => {
    const unsubscribe = onMyFilesystemChange(async (snapshot) => {
      const nodes = snapshot.docs.map(documentSnapshotToJSON).map((node) => ({
        id: node.id,
        name: node.name,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      }));

      store.dispatch(setFolders(nodes));
      setFolderInitialized(true);
      // if (nodes.length === 0) {
      //   const newNote = await createEmptyNote();
      //   navigate(`/note/${newNote.id}`);
      // }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  sortedFolders.sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    // return dateA.getTime() - dateB.getTime(); // Ascending order
    return dateB.getTime() - dateA.getTime(); // Descending order
  });

  // if (sortedFolders.length === 0) return <Spinner />;
  return (
    <>
      {showSetting ? <Setting onClose={() => setShowSetting(false)} /> : null}
      <nav className="navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="/logo-title.png"
              alt="Pure Note"
              style={{ width: 100 }}
            ></img>
          </Link>
          <div className="d-flex">
            <Dropdown>
              <Dropdown.Toggle as={UserMenuToggle} />

              <Dropdown.Menu align={{ sm: "end" }}>
                <Dropdown.Header>{user.email}</Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setShowSetting(true)}>
                  Setting
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    navigate("/logout");
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <span className="btn" onClick={handleAddNote}>
              <HiMiniPlus />
            </span>
            {id && (
              <span className="btn" onClick={handleDeleteNote}>
                <HiTrash />
              </span>
            )}
          </div>
        </div>
      </nav>
      <div
        className="notes-list list-group px-2"
        style={{ overflow: "visible" }}
      >
        {folderInitialized ? (
          sortedFolders.map((folder) => (
            <NavItem
              key={folder.id}
              folder={folder}
              isActive={folder.id === id}
            />
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
};

export default Sidebar;
