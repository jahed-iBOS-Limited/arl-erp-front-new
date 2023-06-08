import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IHistory({ title, clickHandler, classes, styles }) {
    return (
        <OverlayTrigger overlay={<Tooltip id='cs-icon'>{title || "History"}</Tooltip>}>
            <span onClick={() => clickHandler && clickHandler()}>
                <i style={styles} className={`fa pointer fa-server ${classes}`} aria-hidden='true'></i>
            </span>
        </OverlayTrigger>
    );
}