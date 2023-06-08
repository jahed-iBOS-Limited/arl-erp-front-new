import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { APIUrl } from "../../../../App";
import { ProfilePicIcon } from "../../api";
import {
  setPopUpStateAction,
  setSelectedUserDataAction,
} from "../../redux/Action";

export default function SingleRecentMessageCard({ item }) {
  const dispatch = useDispatch();

  return (
    <>
      <div
        onClick={() => {
          dispatch(setSelectedUserDataAction(item));
          dispatch(setPopUpStateAction("room"));
        }}
        className="singleInboxWrapper"
      >
        <div style={{ width: "15%", position: "relative" }}>
          {/* If Image */}
          {item?.strUserImageFile?.length > 4 ? (
            <img
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
              }}
              src={`${APIUrl}/domain/Document/DownlloadFile?id=${item?.strUserImageFile}`}
              alt="avater"
              className="global-chatImg"
            />
          ) : (
            <ProfilePicIcon name={item?.strUserName} />
          )}

          {/* Is Active Small Dot Icon Design */}
          <div
            // className={item?.isOnline ? `animate-pulse` : ""}
            style={{
              backgroundColor: item?.isOnline ? "#10B981" : "lightgray",
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              position: "absolute",
              bottom: "0px",
              right: "0px",
              marginRight: "9px",
              marginBottom: "1px",
              border: "2px solid white",
            }}
          ></div>
        </div>
        <div style={{ width: "85%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "80%",
                display: "flex",
                fontSize: "15px",
              }}
            >
              {item?.strUserName || ""}
            </div>

            {/* If Unseen Message Number greater Then 0 */}
            {+item?.unseenMsgNumber > 0 ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    backgroundColor: "#3699ff",
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    fontWeight: "bold",
                    color: "white",
                    display: "flex",
                    marginRight: "4px",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "9px",
                  }}
                >
                  {+item?.unseenMsgNumber <= 9
                    ? +item?.unseenMsgNumber
                    : `${9}+`}
                </div>
              </div>
            ) : null}
          </div>
          {/* Bu Code */}
          {/* <div>
            <small
              style={{
                fontSize: "60%",
                fontWeight: 500,
                opacity: "70%",
                letterSpacing: "1px",
              }}
            >{` (${item?.strBusinessUnitCode})`}</small>
          </div> */}
          <div
            style={{
              color: "#9CA3AF",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                opacity: +item?.unseenMsgNumber > 0 ? "55%" : "100%",
                color: +item?.unseenMsgNumber > 0 ? "black" : "#9CA3AF",
                fontWeight: +item?.unseenMsgNumber > 0 ? "bold" : "normal",
              }}
            >
              {item?.lastMsg?.slice(0, 24) || ""}{" "}
              {item?.lastMsg?.length > 24 ? "..." : ""}
            </span>
            <span style={{ opacity: "" }}>
              {moment(item?.dateTime, "YYYY-MM-DD HH:mm:ss").fromNow()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
