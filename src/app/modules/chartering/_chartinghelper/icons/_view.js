import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IView({ title, clickHandler, classes }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "View"}</Tooltip>}>
      <span
        onClick={() => {
          if (clickHandler) clickHandler();
        }}
      >
        <i
          className={`fa fa-lg pointer fa-eye ${classes}`}
          aria-hidden="true"
        ></i>
      </span>
    </OverlayTrigger>
  );
}
