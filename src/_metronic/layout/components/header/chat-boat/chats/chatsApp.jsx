import React, { useEffect, useRef, useState } from "react";
import "./chatApp.css";
import MessageBox from "./messageBox";
import { getChatResponse } from "./helper";
import { TimeRemaining } from "./timeRemaining";

const ChatBoatWrapper = ({ timeRemainingCB }) => {
  let [text, setText] = useState("");
  // user chatList/ message list
  const [chatList, setChatList] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);

  // scroll to bottom ref
  const messagesEndRef = useRef(null);

  const autoScrollToBottom = () => {
    const MassegesElem = messagesEndRef?.current;
    if (MassegesElem?.scrollHeight > MassegesElem?.clientHeight) {
      const scroll = MassegesElem?.scrollHeight - MassegesElem?.clientHeight;
      MassegesElem.scrollTop = scroll;
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (chatList.length > 0) {
      const timer = setTimeout(() => {
        autoScrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [chatList]);

  const chatRequestHandelar = () => {
    const modfyData = [...chatList, { text: text, to: true }];
    setChatList(modfyData);
    setMsgLoading(true);
    getChatResponse(
      {
        question: text,
      },
      (obj) => {
        setChatList([...modfyData, { text: obj?.resData, to: false }]);
        setText("");
        setMsgLoading(false);
      }
    );
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <TimeRemaining timeRemainingCB={timeRemainingCB} />
      {/* <ICustomCard title="Chat"> */}
      <div className="row">
        <div className="col-lg-12">
          <MessageBox
            chatList={chatList}
            messagesEndRef={messagesEndRef}
            msgLoading={msgLoading}
            text={text}
            setText={setText}
            chatRequestHandelar={chatRequestHandelar}
          />
        </div>
      </div>
      {/* </ICustomCard> */}
    </div>
  );
};

export default ChatBoatWrapper;
