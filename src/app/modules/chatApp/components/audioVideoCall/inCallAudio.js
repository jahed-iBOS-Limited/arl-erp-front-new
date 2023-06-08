import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ChatAppSocket } from "../..";
import { setCallerDataAction, setCallStageAction } from "../../redux/Action";
import Timer from "./timer";

export default function InCallAudio({ ownVideo, otherVideo, cameraOff }) {
  const dispatch = useDispatch();

  // get user profile data from store
  const { values, profileData } = useSelector((state) => {
    return { profileData: state.authData.profileData, values: state.iChatApp };
  }, shallowEqual);

  return (
    <>
      <div className="chatAppCallUiWrapper">
        {/* Audio Call */}
        <div className="chatAppCallUi">
          <div>
            <div className="chatAppProfilePicUi animate-pulse">
              <span>{values?.callerData?.senderName[0]}</span>
            </div>

            <div className="text-center mt-4">
              <Timer />
            </div>
          </div>

          <div className="chatAppEndSectionAllIcon">
            {/* <span
              onClick={() => {
                ownVideo.current.play();
              }}
            >
              <i class="fas fa-microphone"></i>
            </span>
            <span
              onClick={() => {
                ownVideo.current.pause();
              }}
            >
              <i class="fas fa-microphone-slash"></i>
            </span> */}
            <span
              onClick={() => {
                cameraOff()
                const payload = {
                  senderId: +profileData?.userId,
                  senderName: profileData?.employeeFullName,
                  receiverId: +values?.callerData?.senderId,
                  receiverName: values?.callerData?.senderName,
                };
                ChatAppSocket.emit("endCall", payload);
                dispatch(setCallStageAction("notCalling"));
                dispatch(setCallerDataAction(null));
                // window.location.reload();
              }}
            >
              <i style={{ color: "tomato" }} class="fas fa-phone-square"></i>
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            margin: "80px 250px",
            right: 0,
          }}
        >
          <video style={{ display: "none" }} ref={otherVideo} />
          <video style={{ display: "none" }} ref={ownVideo} />
        </div>
      </div>
    </>
  );
}
