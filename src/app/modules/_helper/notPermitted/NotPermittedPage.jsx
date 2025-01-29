import React from "react";
import ICard from "../_card";
import err from "./err.png";

export default function NotPermittedPage() {
  return (
    <>
      <ICard>
        <div className="not_permitted">
          <div className="not_permitted_left">
            <img
              className="img"
              style={{ width: "360px", height: "250px" }}
              src={err}
              alt="Not permitted"
            ></img>
          </div>
          <div className="not_permitted_right">
            <h4>OOPS. You are not allowed to access this page.</h4>
            <p>
              Don't worry. Since you're valuable to us we will bring you back to
              safety
            </p>
          </div>
        </div>
      </ICard>
    </>
  );
}
