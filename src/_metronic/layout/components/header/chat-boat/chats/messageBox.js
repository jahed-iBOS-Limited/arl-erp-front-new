import React from "react";
import avatar from "./avatar.png";
import ChatAppLoading from "./loading";

const MessageBox = ({
  chatList,
  messagesEndRef,
  msgLoading,
  text,
  setText,
  chatRequestHandelar,
}) => {
  console.log("chatList", chatList);

  return (
    <section className="message-box">
      <div className="cheklist-section cheklist-notification-section">
        {/* <div className="cheklist-section-head">
          <span> iBOS Bot </span>
        </div> */}

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
                      chat?.to
                        ? "checklist-message-body-me"
                        : "checklist-message-body-other"
                    }
                  >
                    <div className="checklist-msg-inner-body">
                      {chat?.to && (
                        <img
                          style={{ width: "25px", height: "25px" }}
                          className="mr-2"
                          src={avatar}
                          alt="avatar"
                        />
                      )}
                      <p dangerouslySetInnerHTML={{ __html: chat?.text }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <form
              className="type-msaage-section"
              onSubmit={(e) => {
                e.preventDefault();
                chatRequestHandelar();
              }}
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
                  onClick={() => {
                    chatRequestHandelar();
                  }}
                  style={{ border: "none", background: "transparent" }}
                  type="button"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {msgLoading && <ChatAppLoading />}
    </section>
  );
};

export default MessageBox;
