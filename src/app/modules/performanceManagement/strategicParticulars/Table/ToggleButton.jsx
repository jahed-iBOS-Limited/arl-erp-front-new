import React from "react";
import "./toggle.css";

export const IToggleButton = ({ selected, toggleSelected }) => {
  return (
    <div className="str-particulars-toggle">
      <div
        className={selected ? "toggle-container active" : "toggle-container"}
        onClick={toggleSelected}
      >
        <div className={`dialog-button ${selected ? "" : "disabled"}`}>
          {selected ? "" : ""}
        </div>
      </div>
    </div>
  );
};
