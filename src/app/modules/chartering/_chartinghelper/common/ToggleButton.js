import React from "react";
import "./togglebutton.css"

export const ToggleButton = ({ selected, toggleSelected }) => {
  return (
    <div
      className={selected ? "toggle-container active" : "toggle-container"}
      onClick={toggleSelected}
    >
      <div className={`dialog-button ${selected ? "" : "disabled"}`}>
        {selected ? "" : ""}
      </div>
    </div>
  );
};
