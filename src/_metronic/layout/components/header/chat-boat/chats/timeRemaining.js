import React, { useState, useEffect } from "react";

export function TimeRemaining({ timeRemainingCB }) {
  const [time, setTime] = useState(15 * 60);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          timeRemainingCB();
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return (
    <p
      style={{
        position: "absolute",
        top: "-25px",
        left: "-12px",
        zIndex: "9",
      }}
    >
      <b
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "3px",
        }}
      >
        <i class="fas fa-clock"></i>
        {`${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`}
      </b>
    </p>
  );
}
