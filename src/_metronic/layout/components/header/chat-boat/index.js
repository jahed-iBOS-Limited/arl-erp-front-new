import React, { useState } from "react";
import IViewModal from "../../../../../app/modules/_helper/_viewModal";
import "./style.scss";
import ChatBoatWrapper from "./chats/chatsApp";
export default function ChatBoat() {
  const [isChatModal, setChatModal] = useState(false);
  const timeRemainingCB = () => {
    setChatModal(false);
  };
  return (
    <>
      <div className="chat-boat-wrapper">
        <div style={{ paddingTop: "8px" }} className="chat-icon mr-5">
          <span
            className="cursor-pointer"
            onClick={() => {
              setChatModal(true);
            }}
          >
            <i
              style={{ fontSize: "14px", color: "#28bef1" }}
              class="fa fa-comments"
              aria-hidden="true"
            ></i>
          </span>
        </div>
      </div>
      {isChatModal && (
        <>
          <IViewModal
            show={isChatModal}
            onHide={() => setChatModal(false)}
            title={"iBOS Chatbot"}
            modelSize={"md"}
          >
            <ChatBoatWrapper timeRemainingCB={timeRemainingCB} />
          </IViewModal>
        </>
      )}
    </>
  );
}
