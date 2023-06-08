import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ChatAppSocket } from "../..";
import { APIUrl } from "../../../../App";
import { ProfilePicIcon } from "../../api";
import {
  setCallerDataAction,
  setCallStageAction,
  setPopUpStateAction,
} from "../../redux/Action";

function Header() {
  const dispatch = useDispatch();
  const [onlineStatus, setOnlineStatus] = useState(false);

  // Get Data from Redux State
  const { values, profileData } = useSelector((state) => {
    return {
      values: state.iChatApp,
      profileData: state.authData.profileData,
    };
  }, shallowEqual);

  useEffect(() => {
    ChatAppSocket.on("getOnlineStatus", (rcvData) => {
      setOnlineStatus(rcvData?.status);
    });

    ChatAppSocket.emit("getOnlineStatus", {
      senderId: profileData?.userId,
      receiverId: +values?.selectedUserData?.intUserId,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(values?.selectedUserData);

  return (
    <>
      <div className="popup-head">
        <div
          style={{ display: "flex", alignItems: "center" }}
          className="popup-head-left pull-left"
        >
          <div style={{ position: "relative" }}>
            {values?.selectedUserData?.strUserImageFile?.length > 4 ? (
              <img
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                }}
                src={`${APIUrl}/domain/Document/DownlloadFile?id=${values?.selectedUserData?.strUserImageFile}`}
                alt="avater"
                className="global-chatImg"
              />
            ) : (
              <ProfilePicIcon
                color="#EF4444"
                name={values?.selectedUserData?.strUserName}
              />
            )}

            {/* Is Active Small Dot Icon Design */}
            {values?.selectedUserData?.lastMsg?.length > 0 ? (
              <div
                style={{
                  backgroundColor: onlineStatus ? "#10B981" : "lightgray",
                  height: "15px",
                  width: "15px",
                  borderRadius: "50%",
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  marginRight: "-4px",
                  marginBottom: "4px",
                  border: "2px solid white",
                }}
              ></div>
            ) : null}
          </div>
          <span
            style={{
              color: "white",
              width: "80%",
              marginLeft: "8px",
            }}
          >
            {values?.selectedUserData?.strUserName?.length < 23
              ? values?.selectedUserData?.strUserName
              : values?.selectedUserData?.strUserName?.slice(0, 23) + "..." ||
                ""}
          </span>
        </div>
        <div className="popup-head-right pull-right">
          <span
            onClick={() => {
              dispatch(setPopUpStateAction("inbox"));
            }}
            data-widget="remove"
            id="removeClass"
            className="chat-header-button pull-right"
            type="button"
          >
            <i
              style={{
                color: "white",
              }}
              class="fas fa-chevron-left"
            ></i>
          </span>
        </div>
        {/* Called */}
        <div className="popup-head-right pull-right">
          <span
            onClick={() => {
              const payload = {
                senderId: +profileData?.userId,
                receiverId: +values?.selectedUserData?.intUserId,
                senderName: profileData?.employeeFullName,
                receiverName: values?.selectedUserData?.strUserName,
              };
              ChatAppSocket.emit("callingTo", payload);
              dispatch(setCallerDataAction(payload));
              dispatch(setCallStageAction("calling"));
            }}
            className="chat-header-button pull-right"
          >
            <i
              style={{
                color: "white",
              }}
              class="fas fa-phone"
            ></i>
          </span>
        </div>
        <div className="popup-head-right pull-right">
          <span
            onClick={() => {
              const payload = {
                senderId: +profileData?.userId,
                receiverId: +values?.selectedUserData?.intUserId,
                senderName: profileData?.employeeFullName,
                receiverName: values?.selectedUserData?.strUserName,
                isVideo: true,
              };
              ChatAppSocket.emit("callingTo", payload);
              dispatch(setCallerDataAction(payload));
              dispatch(setCallStageAction("calling"));
            }}
            className="chat-header-button pull-right"
          >
            <i
              style={{
                color: "white",
              }}
              class="fas fa-video"
            ></i>
          </span>
        </div>
      </div>
    </>
  );
}

export default Header;
