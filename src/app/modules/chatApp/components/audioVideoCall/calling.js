import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setCallStageAction, setCallerDataAction } from "../../redux/Action";
import { ChatAppSocket } from "../..";

export default function Calling({ ownVideo }) {
  const dispatch = useDispatch();

  // get user profile data from store
  const { values, profileData } = useSelector((state) => {
    return { profileData: state.authData.profileData, values: state.iChatApp };
  }, shallowEqual);

  return (
    <>
      <div className="chatAppCallUiWrapper">
        <div className="inCommingCallUi">
          <div style={{ marginBottom: "80px", textAlign: "center" }}>
            <i
              style={{ color: "white", fontSize: "70px" }}
              className="fas fa-phone animate-pulse"
            ></i>
            <div
              style={{
                fontSize: "17px",
                marginTop: "10px",
              }}
            >
              {`You`} calling to {values?.callerData?.receiverName}
            </div>
            <div>
              {values?.callerData?.isVideo ? "Video Call" : "Audio Call"}
            </div>
          </div>

          <div className="chatAppEndSectionAllIcon">
            <span
              onClick={() => {
                const payload = {
                  senderId: +profileData?.userId,
                  senderName: profileData?.employeeFullName,
                  receiverId: +values?.callerData?.receiverId,
                  receiverName: values?.callerData?.receiverName,
                };
                ChatAppSocket.emit("endCall", payload);
                dispatch(setCallStageAction("notCalling"));
                dispatch(setCallerDataAction(null));
              }}
              className="acceptDeclineBtn acceptDeclineBtn-decline"
            >
              End
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
