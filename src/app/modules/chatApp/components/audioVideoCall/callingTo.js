import React, { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChatAppPeer, ChatAppSocket, getUserMedia } from "../..";
import { setCallStageAction, setCallerDataAction } from "../../redux/Action";
import Teams from "./teams.mp3";

export default function CallingTo({ ownVideo, otherVideo }) {
  const dispatch = useDispatch();
  const Audio = useRef();

  // get user profile data from store
  const { profileData, values } = useSelector((state) => {
    return { profileData: state.authData.profileData, values: state.iChatApp };
  }, shallowEqual);

  useEffect(() => {
    // if (isModalVisible) {
    //   Audio?.current?.play();
    // } else Audio?.current?.pause();
    let audio = Audio.current;
    audio.play();
    return () => {
      audio.pause();
    };
  }, []);

  return (
    <>
      <div className="chatAppCallUiWrapper">
      <audio src={Teams} loop ref={Audio} />
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
              Incomming Call from {values?.callerData?.senderName}
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
                  receiverId: values?.callerData?.senderId,
                  receiverName: values?.callerData?.senderName,
                  isVideo: values?.callerData?.isVideo,
                };
                ChatAppSocket.emit("callAccpet", payload);
                localStorage.setItem("callingState",JSON.stringify({
                  isCall: true
                }))
                getUserMedia(
                  { video: true, audio: true },
                  function(stream) {
                    window.localStream = stream;
                    var call = ChatAppPeer.call(
                      `${values?.callerData?.senderId}`,
                      stream
                    );

                    console.log("call", call);

                    ownVideo.current.srcObject = stream;
                    
                    // ownVideo.current.play();

                    ownVideo.current.load();
                    setTimeout(function() {
                      ownVideo.current.muted = true;
                      ownVideo.current.play();
                    }, 0);

                    /* Other Video Come From Another Client */
                    call.on("stream", (remoteStream) => {
                      window.remoteStream = remoteStream;
                      otherVideo.current.srcObject = remoteStream;
                      // otherVideo.current.play();
                      otherVideo.current.load();
                      setTimeout(function() {
                        otherVideo.current.play();
                      }, 0);
                    });
                  },
                  function(err) {
                    console.log("Call Accept Permission Error", err);
                    console.log(
                      "Call Accept Permission Error Stringify",
                      JSON.stringify(err, null, 2)
                    );
                    toast.warning("Camera or microphone permission denied");
                    const payload = {
                      senderId: +profileData?.userId,
                      senderName: profileData?.employeeFullName,
                      receiverId: +values?.callerData?.senderId,
                      receiverName: values?.callerData?.senderName,
                    };
                    ChatAppSocket.emit("endCall", payload);
                    dispatch(setCallStageAction("notCalling"));
                    dispatch(setCallerDataAction(null));
                  }
                );

                if (values?.callerData?.isVideo) {
                  dispatch(setCallStageAction("inCallVideo"));
                } else {
                  dispatch(setCallStageAction("inCallAudio"));
                }
              }}
              className="acceptDeclineBtn"
            >
              Accept
            </span>
            <span
              onClick={() => {
                console.log("Caller data From hhh", values?.callerData);
                const payload = {
                  senderId: +profileData?.userId,
                  senderName: profileData?.employeeFullName,
                  receiverId: +values?.callerData?.senderId,
                  receiverName: values?.callerData?.senderName,
                };
                dispatch(setCallStageAction("notCalling"));
                dispatch(setCallerDataAction(null));
                ChatAppSocket.emit("callDecline", payload);
                localStorage.setItem("callingState",JSON.stringify({
                  isCall: false
                }))
              }}
              className="acceptDeclineBtn acceptDeclineBtn-decline"
            >
              Decline
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
