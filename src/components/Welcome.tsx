import React, { useState } from "react";
import Spinner from "./Spinner";

const Welcome = ({
  onAddNote,
  userDisplayName,
}: {
  onAddNote: () => Promise<void>;
  userDisplayName: string;
}) => {
  const [loading, setLoading] = useState(false);
  async function handleAddNote() {
    setLoading(true);
    await onAddNote();
    setLoading(false);
  }
  return (
    <div className="m-5 text-center">
      <div className="m-5">
        <h1>Welcome to Pure Note</h1>
        <p>{userDisplayName}</p>
      </div>
      <div>
        {loading ? (
          <Spinner />
        ) : (
          <button className="btn btn-primary" onClick={handleAddNote}>
            Create new note
          </button>
        )}
      </div>
    </div>
  );
};

export default Welcome;
