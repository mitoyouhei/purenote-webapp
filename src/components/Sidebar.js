import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HiMiniPlus, HiMiniUserCircle, HiTrash } from "react-icons/hi2";
import { formatDateTime } from "../utils";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { signOut } from "firebase/auth";
import { store } from "../store";
import { logout } from "../slices/user";
import { auth } from "../firebase";
import {
  createEmptyNote,
  deleteNote,
  documentSnapshotToJSON,
  onMyFilesystemChange,
} from "../firebase/Collection";
import { setFolders } from "../slices/folders";
import Setting from "./Setting";

const defaultNoteTitle = "Untitled";

// const FolderMenuToggle = React.forwardRef(({ onClick }, ref) => (
//   <span
//     ref={ref}
//     onClick={(e) => {
//       e.preventDefault();
//       onClick(e);
//     }}
//     className="badge rounded-pill float-end mt-2"
//   >
//     <svg
//       role="graphics-symbol"
//       viewBox="0 0 13 3"
//       className="dots"
//       style={{
//         width: "14px",
//         height: "100%",
//         display: "block",
//         fill: "rgba(55, 53, 47, 0.45)",
//         flexShrink: "0",
//       }}
//     >
//       <g>
//         <path d="M3,1.5A1.5,1.5,0,1,1,1.5,0,1.5,1.5,0,0,1,3,1.5Z"></path>
//         <path d="M8,1.5A1.5,1.5,0,1,1,6.5,0,1.5,1.5,0,0,1,8,1.5Z"></path>
//         <path d="M13,1.5A1.5,1.5,0,1,1,11.5,0,1.5,1.5,0,0,1,13,1.5Z"></path>
//       </g>
//     </svg>
//   </span>
// ));

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

        {/* <Dropdown>
          <Dropdown.Toggle as={FolderMenuToggle} />

          <Dropdown.Menu>
            <Dropdown.Item
              as="div"
              onClick={(e) => handleDeleteFolder(e, folder._id)}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
      </div>
      <small className="fw-lighter" style={{ fontSize: ".675em" }}>
        {formatDateTime(folder.updatedAt)}
      </small>
      {/* <small>{date.toFormat("yyyy-MM-dd HH:mm:ss")}</small> */}
    </Link>
  );
};

const Sidebar = () => {
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
      const nodes = snapshot.docs.map(documentSnapshotToJSON);
      store.dispatch(setFolders(nodes));
      if (nodes.length === 0) {
        const newNote = await createEmptyNote();
        navigate(`/note/${newNote.id}`);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigate]);
  sortedFolders.sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    // return dateA.getTime() - dateB.getTime(); // Ascending order
    return dateB.getTime() - dateA.getTime(); // Descending order
  });

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
                    store.dispatch(logout());
                    signOut(auth);
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <span className="btn" onClick={handleAddNote}>
              <HiMiniPlus />
            </span>
            <span className="btn" onClick={handleDeleteNote}>
              <HiTrash />
            </span>
          </div>
        </div>
      </nav>
      <div
        className="notes-list list-group px-2"
        style={{ overflow: "visible" }}
      >
        {sortedFolders.map((folder) => (
          <NavItem
            key={folder.id}
            folder={folder}
            isActive={folder.id === id}
          />
        ))}
      </div>
    </>
  );
};

export default Sidebar;
