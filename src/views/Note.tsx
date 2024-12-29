import React from "react";

// import { AppLayout } from "../components/AppLayout/AppLayout";
import NoteApp from "../components/NoteApp";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export const Note: React.FC = () => {
  const { id } = useParams();
  const client = useSelector((state: RootState) => state.client);
  const user = useSelector((state: RootState) => state.user) as User | null;
  const navigate = useNavigate();
  return (
    <NoteApp
      id={id ?? null}
      initSiderbarWidth={client.noteSiderbarWidth}
      userDisplayName={user ? user.email ?? "" : ""}
      onLogout={() => {
        navigate("/logout");
      }}
    />
  );

  // return (
  //   <AppLayout
  //     topbar={<span>topbar</span>}
  //     firstNav={<span>firstNav</span>}
  //     secondNav={<span>secondNav</span>}
  //     main={<span>main</span>}
  //   />
  // );
};
