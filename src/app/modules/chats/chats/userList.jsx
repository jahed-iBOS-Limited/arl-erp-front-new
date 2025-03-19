import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ChatAppLoading from "./loading";
import avatar from "./avatar.png";
import { setCurrentChatUserAction } from "./_redux/Actions";
import { getSingleUserMessageList } from "./helper";

const UserList = ({ users, userLoading, setChatList, setMsgLoading }) => {
  const userInfo = useSelector((state) => {
    return state?.authData?.chatAppInfo;
  }, shallowEqual);

  const dispatch = useDispatch();

  return (
    <div className="chat-user-list">
      <div className="header">User list</div>
      {userLoading ? (
        <ChatAppLoading />
      ) : (
        <div className="list">
          {users?.map(
            (user) =>
              // render all user except logged in user
              user?._id !== userInfo?._id && (
                <div
                  onClick={() => {
                    dispatch(setCurrentChatUserAction(user));
                    getSingleUserMessageList(
                      userInfo?._id,
                      user?._id,
                      setChatList,
                      setMsgLoading
                    );
                  }}
                  className="single-user"
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      style={{ width: "25px", height: "25px" }}
                      className="mr-2"
                      src={avatar}
                      alt="avatar"
                    />
                    <div>
                      <div>{user?.name}</div>
                      <small>Software Engineer</small>
                    </div>
                  </div>
                </div>
              )
          )}
          {users?.length < 1 && "No user found"}
        </div>
      )}
    </div>
  );
};

export default UserList;
