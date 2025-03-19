import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IEdit({ title, classes, clickHandler }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "Edit"}</Tooltip>}>
      <span
        onClick={() => {
          if (clickHandler) clickHandler();
        }}
      >
        <i className={`fas fa-lg fa-pen-square pointer ${classes}`}></i>
      </span>
    </OverlayTrigger>
  );
}
