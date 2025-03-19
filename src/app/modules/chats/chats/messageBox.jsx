/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ChatAppLoading from "./loading";
// import io from "socket.io-client";
import { getSingleUserMessageList } from "./helper";
import avatar from "./avatar.png";
import TypingAnimation from "./typingAnimation";

const MessageBox = ({
  setChatList,
  chatList,
  currentChatUser,
  messagesEndRef,
  submitHandler,
  autoScrollToBottom,
  msgLoading,
  setMsgLoading,
}) => {
  const userInfo = useSelector((state) => {
    return state?.authData?.chatAppInfo;
  }, shallowEqual);

  let [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingInfo, setTypingInfo] = useState("");

  // let socket = io(process.env.REACT_APP_CHAT_BACKEND_URL, {
  //   withCredentials: true,
  //   extraHeaders: {
  //     "my-custom-header": "abcd",
  //   },
  // });

  // useEffect(() => {
  //   let socket = io(process.env.REACT_APP_CHAT_BACKEND_URL, {
  //     withCredentials: true,
  //     extraHeaders: {
  //       "my-custom-header": "abcd",
  //     },
  //   });
  //   socket.on(`${userInfo?._id}typing`, (tochatUser, fromChatUser) => {
  //     setTypingInfo({ from: fromChatUser });
  //   });
  //   socket.on(`${userInfo?._id}cancelTyping`, (tochatUser, fromChatUser) => {
  //     setTyping(false);
  //   });
  // }, []);

  useEffect(() => {
    if (currentChatUser?._id === typingInfo?.from?._id) {
      setTyping(true);
      setTimeout(() => {
        autoScrollToBottom();
      }, 100);
    }
  }, [typingInfo]);

  useEffect(() => {
    if (currentChatUser?.wentFrom === "notifications") {
      getSingleUserMessageList(
        userInfo?._id,
        currentChatUser?._id,
        setChatList,
        setMsgLoading
      );
    }
  }, [currentChatUser]);

  return msgLoading ? (
    <ChatAppLoading />
  ) : (
    <section className="message-box">
      <div className="cheklist-section cheklist-notification-section">
        <div className="cheklist-section-head">
          <span> {currentChatUser?.name} </span>
        </div>

        <div className="cheklist-section-body cheklist-notification-body">
          <div className="checklist-message-section">
            <div
              ref={messagesEndRef}
              className="checklist-message-body checklist-order checklist-order-scroll"
            >
              <div className="checklist-message-body-online">
                {/* <h4>online</h4>
                <p>Sun, 21 Apr, 13 : 40</p> */}
              </div>
              <ul className="msg-list">
                {chatList?.map((chat, index) => (
                  <li
                    className={
                      userInfo?._id === chat?.to
                        ? "checklist-message-body-other"
                        : "checklist-message-body-me"
                    }
                  >
                    <div className="checklist-msg-inner-body">
                      {userInfo?._id === chat?.to && (
                        <img
                          style={{ width: "25px", height: "25px" }}
                          className="mr-2"
                          src={avatar}
                          alt="avatar"
                        />
                      )}

                      <p>{chat?.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {typing && <TypingAnimation currentChatUser={currentChatUser} />}
            </div>

            <form
              onSubmit={(e) => {
                setText("");
                submitHandler(e, text, setText);
              }}
              className="type-msaage-section"
            >
              <input
                type="text"
                className="form-control message-input"
                placeholder="Type your message..."
                value={text}
                onFocus={() => {
                  // socket.emit("sendTyping", currentChatUser, userInfo);
                }}
                // onBlur={() => socket.emit("cancelTyping", currentChatUser)}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="message-scroll">
                <button
                  style={{ border: "none", background: "transparent" }}
                  type="submit"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageBox;
