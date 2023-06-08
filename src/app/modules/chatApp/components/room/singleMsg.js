import moment from "moment";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { APIUrl } from "../../../../App";
import { ProfilePicIcon } from "../../api";

function SingleMsg({ item }) {
  // Get Data from Redux State
  const { values, profileData } = useSelector((state) => {
    return {
      values: state.iChatApp,
      profileData: state.authData.profileData,
    };
  }, shallowEqual);

  return (
    <>
      {/* Divider With Date */}
      {/* <div className="chat-box-single-line">
        <abbr className="timestamp">October 9th, 2015</abbr>
      </div> */}

      {profileData?.userId !== +item?.senderId ? (
        <div>
          {/* Left Chat | Sender */}
          <div className="direct-chat-info clearfix">
            <span className="direct-chat-name pull-left">
              {values?.selectedUserData?.strUserName}
            </span>
          </div>

          {values?.selectedUserData?.strUserImageFile?.length > 4 ? (
            <img
              alt="iamgurdeepEmdadul Hauqe"
              src={`${APIUrl}/domain/Document/DownlloadFile?id=${values?.selectedUserData?.strUserImageFile}`}
              className="direct-chat-img global-chatImg"
            />
          ) : (
            <ProfilePicIcon
              className="direct-chat-img"
              color="#EF4444"
              name={values?.selectedUserData?.strUserName}
            />
          )}

          <div className="direct-chat-text">{item?.body || ""}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: "50px",
            }}
            className="direct-chat-info clearfix"
          >
            <span
              style={{ fontSize: "11px" }}
              className="direct-chat-timestamp pull-right pb-2"
            >
              {moment(item?.dateTime, "YYYY-MM-DD HH:mm:ss").fromNow()}
            </span>
          </div>
        </div>
      ) : (
        <div>
          {/* Right Chat | Me | Logged in User */}
          <div className="direct-chat-info clearfix">
            <span className="direct-chat-name-right pull-right">
              {profileData?.employeeFullName || ""}
            </span>
          </div>

          {profileData?.userImageFile?.length > 0 ? (
            <img
              alt="iamgurdeepEmdadul Hauqe"
              src={`${APIUrl}/domain/Document/DownlloadFile?id=${profileData?.userImageFile}`}
              className="direct-chat-img-right global-chatImg"
            />
          ) : (
            <ProfilePicIcon
              color="#F59E0B"
              className="direct-chat-img-right"
              name={profileData?.employeeFullName}
            />
          )}

          <div className="direct-chat-text-right text-right">
            {item?.body || ""}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "45px",
            }}
            className="direct-chat-info clearfix"
          >
            <span
              style={{ fontSize: "11px" }}
              className="direct-chat-timestamp pull-left pb-2"
            >
              {moment(item?.dateTime, "YYYY-MM-DD HH:mm:ss").fromNow()}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleMsg;
