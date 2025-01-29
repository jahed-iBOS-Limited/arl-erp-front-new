import React from "react";
import one from "./images/one.svg";
import "./_loading.css";

function Loading() {
  return (
    <div className="global-loading-css">
      <img width="80" height="80" src={one} alt="Loading" />
    </div>
  );
}

export default Loading;
