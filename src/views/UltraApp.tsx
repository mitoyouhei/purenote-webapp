import React from "react";
import { AppLayout } from "../components/AppLayout/AppLayout";

export const UltraApp: React.FC = () => {
  return (
    <AppLayout
      topbar={<span>topbar</span>}
      firstNav={<span>firstNav</span>}
      secondNav={<span>secondNav</span>}
      main={<span>main</span>}
    />
  );
};
