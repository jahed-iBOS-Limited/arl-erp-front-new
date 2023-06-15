import React from "react";
export default function Chips(props) {
    return (
        <>
            <span style={{ height: "17px", width: "50px" }} class={`badge badge-pill ${props?.classes}`}>{props?.status}</span>
        </>
    );
}