import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IEdit({ title, classes, onClick }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "Edit"}</Tooltip>}>
      <span>
        <i
          className={`fas fa-pen-square pointer ${classes}`}
          onClick={() => onClick && onClick()}
        ></i>
      </span>
    </OverlayTrigger>
  );
}
