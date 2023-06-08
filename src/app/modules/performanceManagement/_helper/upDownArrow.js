import React from "react";
import GlobalMaxMin from "./GlobalMaxMin";
import SbuMin from "./SbuMin";
import IndividualMin from "./IndividualMin";

export default function UpDownArrow({ r, type }) {
  return (
    <>
      <div>
        {type === "sbu" && r.intMaxMin === 2 ? (
          <SbuMin r={r} />
        ) : type === "individual" && r.intMaxMin === 2 ? (
          <IndividualMin r={r} />
        ) : (
          <GlobalMaxMin r={r} />
        )}
      </div>
    </>
  );
}
