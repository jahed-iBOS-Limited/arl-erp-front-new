import React from "react";

export default function CreateButton({ clickHandler }) {
  return (
    <button
      onClick={() => {
        if (clickHandler) clickHandler();
      }}
      className="btn btn-primary create-button"
    >
      Create
    </button>
  );
}
