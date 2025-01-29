/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
import ICustomCard from "../../_helper/_customCard";
import MessageBox from "./messageBox";
import UserList from "./userList";
import "./chatApp.css";
import { getAllChatUsers, sendMessage } from "./helper";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCurrentChatUserEmptyAction } from "./_redux/Actions";

const ChatApps = () => {
  const userInfo = useSelector((state) => {
    return state?.authData?.chatAppInfo;
  }, shallowEqual);

  const currentChatUser = useSelector((state) => {
    return state?.chatApp?.currentChatUser;
  }, shallowEqual);

  const chatAppUserInfo = useSelector((state) => state?.authData?.chatAppInfo);

  const [userLoading, setUserLoading] = useState(false);

  const [users, setUsers] = useState([]);

  // new msg
  const [newMsg, setNewMsg] = useState(null);

  const dispatch = useDispatch();

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

  useEffect(() => {
    getAllChatUsers(setUsers, setUserLoading);
    return () => {
      dispatch(setCurrentChatUserEmptyAction());
    };
  }, []);

  const submitHandler = (e, text) => {
    e.preventDefault();

    let payload = {
      fromId: userInfo?._id,
      toId: currentChatUser?._id,
      text: text,
    };
    if (text === "") return toast.warn("Add message");
    sendMessage(payload, chatList, setChatList);
  };

  // useEffect(() => {
  //   let socket = io(process.env.REACT_APP_CHAT_BACKEND_URL, {
  //     withCredentials: true,
  //     extraHeaders: {
  //       "my-custom-header": "abcd",
  //     },
  //   });

  //   socket.on(`${chatAppUserInfo?._id}newMessage`, (newMessage) => {
  //     if (newMessage) {
  //       setNewMsg(newMessage);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (newMsg?.from === currentChatUser?._id) {
      setChatList([...chatList, newMsg]);
    }
  }, [newMsg]);

  useEffect(() => {
    if (currentChatUser?.name) {
    }
    if (chatList.length > 0) {
      setTimeout(() => {
        autoScrollToBottom();
      }, 100);
    }
  }, [chatList]);

  return (
    <div>
      <ICustomCard title="Chat">
        <div className="row">
          <div className="col-lg-4">
            <UserList
              setMsgLoading={setMsgLoading}
              autoScrollToBottom={autoScrollToBottom}
              users={users}
              setChatList={setChatList}
              userLoading={userLoading}
            />
          </div>
          <div className="col-lg-8">
            {currentChatUser ? (
              <MessageBox
                messagesEndRef={messagesEndRef}
                setChatList={setChatList}
                chatList={chatList}
                msgLoading={msgLoading}
                autoScrollToBottom={autoScrollToBottom}
                currentChatUser={currentChatUser}
                submitHandler={submitHandler}
                setMsgLoading={setMsgLoading}
              />
            ) : (
              <div style={{ marginTop: "30px" }}>
                <b>Please Select User</b>
              </div>
            )}
          </div>
        </div>
      </ICustomCard>
    </div>
  );
};

export default ChatApps;
