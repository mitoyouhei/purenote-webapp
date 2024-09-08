import React, { useState } from "react";
import { createEmptyNote } from "../firebase/Collection";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";

const Welcome = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const handleAddNote = async () => {
    setLoading(true);
    const newNote = await createEmptyNote();
    navigate(`/note/${newNote.id}`);
    setLoading(false);
  };
  return (
    <div className="m-5 text-center">
      <div className="m-5">
        <h1>Welcome to Pure Note</h1>
        <p>{user.email}</p>
      </div>
      <p>
        {loading ? (
          <Spinner />
        ) : (
          <button className="btn btn-primary" onClick={handleAddNote}>
            Create new note
          </button>
        )}
      </p>
    </div>
  );
};

export default Welcome;
