import { IconButton } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownlloadFileView_Action } from '../../../../../app/modules/_helper/_redux/Actions';
import { NotificationRirectFunc } from './helper';

const NotiBodyContent = ({ content, orgId, buId, handleClose, setLoading }) => {
  const { peopledeskApiURL } = useSelector((state) => state.authData);
  const {
    notifyDetails,
    notifyTitle,
    timeDifference,
    notificationMaster,
    isSeen,
  } = content;
  const dispatch = useDispatch();
  return (
    <>
      <div
        className={
          isSeen
            ? `notification-popover-body-main-content`
            : `notification-popover-body-main-content unseen`
        }
        style={{
          cursor: 'pointer',
          borderBottom: '1px solid #D0D5DD',
          width: '346px',
        }}
        onClick={(e) => {
          if (notificationMaster?.strFeature === 'policy') {
            const policyFileUrl = async () => {
              try {
                let { data } = await axios.get(
                  `${peopledeskApiURL}/SaasMasterData/GetUploadedPolicyByIdErp?AccountId=${orgId}&BusinessUnitId=${buId}&PolicyId=${notificationMaster?.intFeatureTableAutoId}`
                );
                if (data?.intPolicyFileUrlId) {
                  const callback = () => {
                    handleClose();
                  };
                  dispatch(
                    getDownlloadFileView_Action(
                      data?.intPolicyFileUrlId,
                      false,
                      callback,
                      setLoading
                    )
                  );
                }
              } catch (error) {
                return error;
              }
            };
            policyFileUrl();
          }
          content?.routeUrl &&
            NotificationRirectFunc({
              ...content,
              peopledeskApiURL: peopledeskApiURL,
            });
        }}
      >
        <div className="d-flex">
          <div>
            <div className="notification-popover-body-main-content-avatar">
              <IconButton
                className="circle-button-icon"
                style={{ height: '40px', width: '40px' }}
              >
                {notificationMaster?.strModule === 'Employee Management' && (
                  <GroupIcon></GroupIcon>
                )}
                {notificationMaster?.strFeature === 'policy' && (
                  <SettingsIcon></SettingsIcon>
                )}
              </IconButton>
            </div>
          </div>
          <div>
            {/* <div className="notification-popover-body-main-content-title"> */}

            <div className="notification-body-header">
              <div className="d-flex justify-content-between ">
                <h6>{notifyTitle?.toUpperCase() || ''}</h6>
                <h6>
                  {timeDifference === 'now'
                    ? timeDifference
                    : `${timeDifference} ago`}
                </h6>
              </div>
              <div>
                <span>{notifyDetails || ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotiBodyContent;
