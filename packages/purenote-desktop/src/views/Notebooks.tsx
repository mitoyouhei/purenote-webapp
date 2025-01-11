import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNotesInNotebook as setNotebooks } from "purenote-core";

export const Notebooks: React.FC = () => {
  const dispatch = useDispatch();
  const notebooks = useSelector((state: any) => state.notebook.notebooks);

  useEffect(() => {
    const mockNotebooks = [
      { id: "1", name: "笔记本1", notes: [] },
      { id: "2", name: "笔记本2", notes: [] },
    ];
    dispatch(setNotebooks(mockNotebooks));
  }, [dispatch]);

  return (
    <div>
      <h1>笔记本列表</h1>
      <ul>
        {notebooks.map((notebook: any) => (
          <li key={notebook.id}>{notebook.name}</li>
        ))}
      </ul>
    </div>
  );
};
