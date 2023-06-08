import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import icon from './costIcon.svg';

export default function CostView({ title, clickHandler, classes }) {
  return (
    <OverlayTrigger overlay={<Tooltip id='cs-icon'>{title || "View"}</Tooltip>}>
      <span onClick={() => clickHandler && clickHandler()}>
        {/* <i className={`costEye ${classes}`} aria-hidden='true'></i> */}
        <img width="16px" src={icon} alt="My Happy SVG"/>
      </span>
    </OverlayTrigger>
  );
}
