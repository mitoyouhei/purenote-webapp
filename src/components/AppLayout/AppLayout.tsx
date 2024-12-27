import "./AppLayout.css";
import React, { useEffect, useRef, useState } from "react";

const FIRST_PERCENTAGE = 0.15;
const SECOND_PERCENTAGE = 0.15;
const MAX_TOTAL_PERCENTAGE = 0.5;
const MIN_NAV_WIDTH = 200;
const MIN_TOTAL_WIDTH = 800;

const TOP_NAV_HEIGHT = 50;

const Dragger: React.FC<{ onDrag: (change: number) => void }> = ({
  onDrag,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;

    const handleMouseMove = (e: MouseEvent) => {
      let change = e.clientX - startX;
      onDrag(change);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
  };
  return (
    <div
      className="position-absolute top-0 end-0 h-100 border-end dragger"
      onMouseDown={handleMouseDown}
    ></div>
  );
};

const FirstNav: React.FC<{
  width: number;
  onDrag: (change: number) => void;
  children: React.ReactNode;
}> = ({ width, onDrag, children }) => {
  return (
    <div
      className="position-fixed top-0 start-0 h-100"
      style={{
        // backgroundColor: "#eee",
        paddingTop: TOP_NAV_HEIGHT,
        width,
      }}
    >
      {children}
      <Dragger onDrag={onDrag} />
    </div>
  );
};
const SecondNav: React.FC<{
  width: number;
  left: number;
  onDrag: (change: number) => void;
  children: React.ReactNode;
}> = ({ width, left, onDrag, children }) => {
  return (
    <div
      className="position-fixed top-0 h-100"
      style={{
        // backgroundColor: "#ddd",
        paddingTop: TOP_NAV_HEIGHT,
        width,
        left,
      }}
    >
      {children}
      <Dragger onDrag={onDrag} />
    </div>
  );
};
const TopNav: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100"
      style={{
        height: TOP_NAV_HEIGHT,
        // backgroundColor: "red",
      }}
    >
      {children}
    </div>
  );
};

export const AppLayout: React.FC<{
  topbar: React.ReactNode;
  firstNav: React.ReactNode;
  secondNav: React.ReactNode;
  main: React.ReactNode;
}> = ({ topbar, firstNav, secondNav, main }) => {
  const [firstPercentage, setFirstPercentage] = useState(FIRST_PERCENTAGE);
  const [secondPercentage, setSecondPercentage] = useState(SECOND_PERCENTAGE);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const firstNavWidth = Math.max(
    MIN_NAV_WIDTH,
    Math.floor(windowWidth * firstPercentage)
  );
  const secondNavWidth = Math.max(
    MIN_NAV_WIDTH,
    Math.floor(windowWidth * secondPercentage)
  );

  return (
    <div
      id="app-layout"
      className="position-fixed top-0 start-0 h-100 w-100"
      style={{
        minWidth: `${MIN_TOTAL_WIDTH}px`,
        paddingTop: TOP_NAV_HEIGHT,
        paddingLeft: firstNavWidth + secondNavWidth,
      }}
    >
      <div>{main}</div>
      <FirstNav
        width={firstNavWidth}
        onDrag={(change) => {
          const newFirstWidth = firstNavWidth + change;
          const newFirstPercentage = newFirstWidth / windowWidth;

          const max = MAX_TOTAL_PERCENTAGE - secondPercentage;
          setFirstPercentage(Math.min(newFirstPercentage, max));
        }}
      >
        {firstNav}
      </FirstNav>
      <SecondNav
        width={secondNavWidth}
        left={firstNavWidth}
        onDrag={(change) => {
          const newSecondWidth = secondNavWidth + change;
          const newSecondPercentage = newSecondWidth / windowWidth;

          const max = MAX_TOTAL_PERCENTAGE - firstPercentage;
          setSecondPercentage(Math.min(newSecondPercentage, max));
        }}
      >
        {secondNav}
      </SecondNav>
      <TopNav>{topbar}</TopNav>
    </div>
  );
};
