import React, { useState } from "react";
import SingleRecentGroupMessageCard from "./singleRecentGroupMessageCard";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  setPopUpStateAction,
  setSearchUserListAction,
  setSearchUserTextAction,
  setSelectedUserDataAction,
} from "../../redux/Action";
import ChatAppTabComponent from "../common/chatAppTabComponent";
import IViewModal from "../../../_helper/_viewModal";
import CreateGroupModal from "./createGroupModal/addEditForm";

export default function ChatAppGroupInbox() {
  const dispatch = useDispatch();
  const [createGroupModal, setCreateGroupModal] = useState(false);

  // Get Data from Redux State
  const { values } = useSelector((state) => {
    return {
      values: state.iChatApp,
    };
  }, shallowEqual);

  return (
    <>
      <div
        className="chat-box-main-wrapper popup-box chat-popup popup-box-on"
        id="qnimate"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="popup-head"
        >
          <div>
            <h3 style={{ color: "white" }}>
              <i style={{ color: "white" }} class="fas fa-comment-dots"></i>{" "}
              iChat
            </h3>
          </div>

          <div>
            <span
              onClick={() => {
                dispatch(setSearchUserTextAction(""));
                dispatch(setSearchUserListAction(null));
                dispatch(setSelectedUserDataAction(null));
                dispatch(setPopUpStateAction("close"));
              }}
              data-widget="remove"
              id="removeClass"
              className="chat-header-button pull-right"
              type="button"
            >
              <i
                style={{
                  color: "white",
                }}
                class="fas fa-times"
              ></i>
            </span>
          </div>
        </div>

        {/* Tab Menu */}
        {!values?.searchUserText?.length ? <ChatAppTabComponent /> : null}

        <div className="popup-messages">
          <div
            style={{
              paddingBottom: "0px",
              position: "relative",
            }}
            className="direct-chat-messages"
          >
            {/* Single Card Recent Group Message */}
            {values?.recentGroupChatUserList?.length ? (
              values?.recentGroupChatUserList?.map((item) => (
                <SingleRecentGroupMessageCard item={item} />
              ))
            ) : (
              <div className="text-center">No Group Found</div>
            )}
          </div>

          <button
            type="button"
            className="group-create-button"
            onClick={() => {
              setCreateGroupModal(true);
            }}
          >
            <i style={{ color: "white" }} class="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div className="chat-app-create-group-from">
        <IViewModal
          modelSize="md"
          title="Create Chat Group"
          show={createGroupModal}
          onHide={() => setCreateGroupModal(false)}
        >
          <CreateGroupModal
            data={{}}
            setCreateGroupModal={setCreateGroupModal}
          />
        </IViewModal>
      </div>
    </>
  );
}
