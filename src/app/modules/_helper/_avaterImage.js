import React from "react";
import { APIUrl } from "../../App";

export function AvaterImage({ height, width, src, alt }) {
  return (
    <img
      style={{
        height: "25px",
        width: "25px",
        borderRadius: "50%",
        objectFit: "cover",
        objectPosition: "center",
      }}
      src={
        src
          ? `${APIUrl}/domain/Document/DownlloadFile?id=${src}`
          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6z66OmdfMJch6a6TJUKEwpf2IBP5ehutV3g&usqp=CAU"
      }
      alt={"avater"}
      className="avaterLogo"
    />
  );
}
