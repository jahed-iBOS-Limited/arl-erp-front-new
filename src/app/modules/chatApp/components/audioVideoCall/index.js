import React, { useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ChatAppPeer, ChatAppSocket, getUserMedia } from "../..";
import { setCallerDataAction, setCallStageAction } from "../../redux/Action";
import Calling from "./calling";
import CallingTo from "./callingTo";
import CallNotAccept from "./callNotAccept";
import InCallAudio from "./inCallAudio";
import InCallVideo from "./InCallVideo";

function AudioVideoCall({ ownVideo, otherVideo }) {
  const dispatch = useDispatch();

  const cameraOff = () => {
    localStorage.setItem("callingState",JSON.stringify({
      isCall: false
    }))
    try {
      ownVideo.current.pause();
      ownVideo.current.src = "";
      window.localStream.getTracks().forEach((x) => x.stop());
    } catch (error) {}
  };

  // get user profile data from store
  const { values, profileData } = useSelector((state) => {
    return { profileData: state.authData.profileData, values: state.iChatApp };
  }, shallowEqual);

  useEffect(() => {
    ChatAppSocket.on("callingTo", (data) => {
      // console.log("values?.callStage", values?.callStage)
      let callingState = JSON.parse(localStorage.getItem("callingState"));
      console.log("callingState", callingState)
      if (callingState?.isCall) {
        const payload = {
          senderId: +profileData?.userId,
          senderName: profileData?.employeeFullName,
          receiverId: +data?.senderId,
          receiverName: data?.senderName,
          isAlreadyInCall: true,
        };
        ChatAppSocket.emit("callDecline", payload);
        return null;
      } else {
        console.log("call receive");
        dispatch(setCallerDataAction(data));
        dispatch(setCallStageAction("callingTo"));
      }
    });

    ChatAppSocket.on("callDecline", (data) => {
      if(data?.isAlreadyInCall){
        toast.warn("Already in call")
      }
      dispatch(setCallerDataAction(data));
      dispatch(setCallStageAction("decline"));
    });

    ChatAppSocket.on("endCall", (data) => {
      cameraOff();
      dispatch(setCallerDataAction(null));
      dispatch(setCallStageAction("notCalling"));
    });

    ChatAppSocket.on("callAccpet", (data) => {
      localStorage.setItem("callingState",JSON.stringify({
        isCall: true
      }))
      dispatch(setCallerDataAction(data));
      if (data?.isVideo) {
        dispatch(setCallStageAction("inCallVideo"));
      } else {
        dispatch(setCallStageAction("inCallAudio"));
      }
    });
    return () => {
      localStorage.setItem("callingState",JSON.stringify({
        isCall: false
      }))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ChatAppPeer.on("call", (call) => {
      getUserMedia(
        { video: true, audio: true },
        (stream) => {
          window.localStream = stream;
          ownVideo.current.srcObject = stream;
          // ownVideo.current.play();
          ownVideo.current.load();
          setTimeout(function() {
            ownVideo.current.muted = true;
            ownVideo.current.play();
          }, 0);

          call.answer(stream);
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
        (err) => {
          console.log("Call Start in UseEffect Permission Error", err);
          console.log(
            "Call Start in UseEffect Permission Error Stringify",
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        {values?.callStage === "calling" ? (
          <div className="chatAppCallBlackOverlay"></div>
        ) : null}

        {/* Calling Stage */}
        {values?.callStage === "calling" ? (
          <Calling ownVideo={ownVideo} />
        ) : null}

        {/* InComming Call Stage */}
        {values?.callStage === "callingTo" ? (
          <CallingTo ownVideo={ownVideo} otherVideo={otherVideo} />
        ) : null}

        {/* In Call Audio Stage */}
        {values?.callStage === "inCallAudio" && !values?.callerData?.isVideo ? (
          <InCallAudio
            cameraOff={cameraOff}
            ownVideo={ownVideo}
            otherVideo={otherVideo}
          />
        ) : null}

        {/* In Call Video Stage */}
        {values?.callStage === "inCallVideo" && values?.callerData?.isVideo ? (
          <InCallVideo
            cameraOff={cameraOff}
            ownVideo={ownVideo}
            otherVideo={otherVideo}
          />
        ) : null}

        {/* Decline Stage */}
        {values?.callStage === "decline" ? <CallNotAccept /> : null}
      </div>
    </>
  );
}

export default AudioVideoCall;
