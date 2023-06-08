import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function ICon({ title, onClick, classes, children }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || ""}</Tooltip>}>
      <span
        className={`pointer ${classes}`}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </span>
    </OverlayTrigger>
  );
}
