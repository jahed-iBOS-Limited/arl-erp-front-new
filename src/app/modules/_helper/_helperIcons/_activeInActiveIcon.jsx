import React from "react";
import "./icons.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import inActive from "./inActive.svg";
import active from "./active.svg";

export default function IActiveInActiveIcon({ title, classes, iconTyee }) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id="cs-icon">{title || "Active"}</Tooltip>}
    >
      <>
        {iconTyee === "inActive" ? (
          <img src={inActive} alt="" className="activeInActiveIcon" />
        ) : (
          <img src={active} alt="" className="activeInActiveIcon" />
        )}
      </>
    </OverlayTrigger>
  );
}
