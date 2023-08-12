

import { IconButton } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';
import React from "react";

const NotiBodyContent = ({ content, orgId, buId, handleClose, setLoading }) => {
 
  const { notifyDetails, module, timeDifference, notificationMaster, isSeen } =
    content;

  return (
    <>
      <div
        className={
          isSeen
            ? `notification-popover-body-main-content`
            : `notification-popover-body-main-content unseen`
        }
        style={{
          cursor: "pointer",
          borderBottom: "1px solid #D0D5DD",
          width: "346px",
        }}
        onClick={(e) => {
          // if (notificationMaster?.strFeature === "leave_application") {
          //   const win = window.open("/approval/leaveApproval", "_blank");
          //   win.focus();
          // }
          // if (notificationMaster?.strFeature === "movement_application") {
          //   const win = window.open("/approval/movementApproval", "_blank");
          //   win.focus();
          // }
          // if (notificationMaster?.strFeature === "policy") {

          //   const policyFileUrl = async () => {
          //     try {
          //       let { data } = await axios.get(
          //         `/SaasMasterData/GetUploadedPolicyById?AccountId=${orgId}&BusinessUnitId=${buId}&PolicyId=${notificationMaster?.intFeatureTableAutoId}`
          //       );
          //       if (data?.intPolicyFileUrlId) {
          //         const callback = () => {
          //           handleClose();
          //         };
          //         dispatch(
          //           getDownlloadFileView_Action(
          //             data?.intPolicyFileUrlId,
          //             false,
          //             callback,
          //             setLoading
          //           )
          //         );
          //       }
          //     } catch (error) {
          //       return error;
          //     }
          //   };
          //   policyFileUrl();
          // }
        }}
      >
        <div className="d-flex">
          <div>
            <div className="notification-popover-body-main-content-avatar">
              <IconButton
                className="circle-button-icon"
                style={{ height: "40px", width: "40px" }}
              >
                {notificationMaster?.strModule === "Employee Management" && (
                  <GroupIcon></GroupIcon>
                )}
                {notificationMaster?.strFeature === "policy" && (
                  <SettingsIcon></SettingsIcon>
                )}
              </IconButton>
            </div>
          </div>
          <div>
            {/* <div className="notification-popover-body-main-content-title"> */}

            <div className="notification-body-header">
              <div className="d-flex justify-content-between ">
                <h6>{module?.toUpperCase() || ""}</h6>
                <h6>
                  {timeDifference === "now"
                    ? timeDifference
                    : `${timeDifference} ago`}
                </h6>
              </div>
              <div>
                <span>{notifyDetails || ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotiBodyContent;
