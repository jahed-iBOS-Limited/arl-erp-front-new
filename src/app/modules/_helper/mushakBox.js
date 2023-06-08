import React from "react";

export const MushakBox = ({ title, mushakNumber }) => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <h2 className="text-center">
        <b>{`${title}`}</b>
      </h2>

      <span
        style={{
          position: "absolute",
          top: 0,
          right: 15,
          padding: "3px 5px",
          border: "2px solid gray",
        }}
      >
        Mushak {`${mushakNumber}`}
      </span>
    </div>
  );
};
