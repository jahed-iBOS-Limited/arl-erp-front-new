import React, { useEffect } from "react";
import "./style.scss";
import useAxiosPost from "../../../../../app/modules/_helper/customHooks/useAxiosPost";
export default function ChatBoat() {
  const [res, getRes] = useAxiosPost();
  useEffect(() => {
    getRes(`https://deverpchat.ibos.io/erp/manual_qna`, {
      question: "What is javascript",
    });
  }, []);
  return (
    <div className="chat-boat-wrapper">
      <div style={{ paddingTop: "7px" }} className="chat-icon mr-5">
        <span
          className="cursor-pointer"
          onClick={() => {
            getRes(`https://deverpchat.ibos.io/erp/manual_qna`, {
              question: "Hi",
            });
          }}
        >
          <i
            style={{ fontSize: "14px" }}
            class="fa fa-comments"
            aria-hidden="true"
          ></i>
        </span>
        <div className="chat-card">
          <div className="header">
            <div className="flex">
              <div>
                <h6>Chat</h6>
              </div>
              <div>
                <span>
                  <i class="fa fa-times" aria-hidden="true"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="chat-box"></div>
          <div className="chat-input"></div>
        </div>
      </div>
    </div>
  );
}
