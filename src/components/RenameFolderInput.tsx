import React, { useEffect, useRef, useState } from "react";

const RenameFolderInput = ({
  initialValue,
  onConfirm,
  onCancel,
}: {
  initialValue: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onConfirm(name);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="d-flex align-items-center">
      <input
        ref={inputRef}
        className="input-title"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="btn-group ms-2">
        <button
          className="btn btn-sm btn-success"
          onClick={() => onConfirm(name)}
        >
          确认
        </button>
        <button
          className="btn btn-sm btn-light"
          onClick={onCancel}
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default RenameFolderInput;
