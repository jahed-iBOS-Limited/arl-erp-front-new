import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function ReceiveIcon({ title, clickHandler, classes }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "Item Receive"}</Tooltip>}>
      <span onClick={() => clickHandler()}>
        <i className={`fas pointer fa-sharp fa-solid fa-arrow-down ${classes}`} aria-hidden="true"></i>
      </span>
    </OverlayTrigger>
  );
}