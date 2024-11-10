import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IEdit({ title, classes,clickHandler }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "Extend"}</Tooltip>}>
      <span onClick={() => {
        if(clickHandler) clickHandler()
      }}>
        <i className={`fa fa-lg fa-arrows-alt pointer ${classes}`} aria-hidden="true"></i>
      </span>
    </OverlayTrigger>
  );
}
