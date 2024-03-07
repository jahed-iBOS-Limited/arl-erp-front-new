import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function NewIcon({
  title,
  clickHandler,
  iconName,
  classes,
  styles,
}) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "View"}</Tooltip>}>
      <span onClick={() => clickHandler && clickHandler()} style={{cursor:"pointer"}}>
        <i
          style={styles}
          className={`${
            iconName ? iconName : "fa pointer fa-eye"
          }  ${classes}`}
          aria-hidden="true"
        ></i>
      </span>
    </OverlayTrigger>
  );
}
