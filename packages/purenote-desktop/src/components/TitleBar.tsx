import React from 'react';
import { Window } from '@tauri-apps/api/window';
import './TitleBar.css';

const TitleBar: React.FC = () => {
  const handleMinimize = async () => {
    const window = Window.getCurrent();
    await window.minimize();
  };

  const handleMaximize = async () => {
    const window = Window.getCurrent();
    const isMaximized = await window.isMaximized();
    if (isMaximized) {
      await window.unmaximize();
    } else {
      await window.maximize();
    }
  };

  const handleClose = async () => {
    const window = Window.getCurrent();
    await window.close();
  };

  return (
    <div className="titlebar">
      <div className="titlebar-button-container">
        <button onClick={handleMinimize} className="titlebar-button minimize">
          _
        </button>
        <button onClick={handleMaximize} className="titlebar-button maximize">
          □
        </button>
        <button onClick={handleClose} className="titlebar-button close">
          ×
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
