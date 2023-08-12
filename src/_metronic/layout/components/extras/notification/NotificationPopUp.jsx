/* eslint-disable no-restricted-imports */
import React, { useState } from "react";
import { getAllNotificationsActions } from "./helper";
import NotiBodyContent from "./NotiBodyContent";
import Loading from './../../../../../app/modules/_helper/_loading';
import useDebounce from './../../../../../app/modules/_helper/customHooks/useDebounce';
import { IconButton, Popover } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress';

const NotificationPopUp = ({ propsObj }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    employeeId,
    orgId,
    buId,
    data,
    setData,
    loading,
    pageNo,
    setPageNo,
    pageSize,
    setLoading,
  } = propsObj;

  const [notficationLoading, setNotificationLoading] = useState(false);
  const debounce = useDebounce();

  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          minWidth: "346px",
          // maxHeight: "360px",
          // padding: "0px 5px",
          "&::-webkit-scrollbar": {
            display: "none"
          }
        },
      }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div className="notification-popover">
        {loading && <Loading />}
        <div className="notification-popover-header">
          <h6>Notification</h6>

          <div className="notification-popover-header-icon">
            <IconButton
              onClick={(e) => {
                handleClose();
                e.stopPropagation();
              }}
            >
              <CloseIcon
                sx={{ fontSize: "20px", color: 'rgba(0, 0, 0, 0.6)' }}
              />
            </IconButton>
          </div>
        </div>
        <div
          className="notification-popover-body-content"
          style={{ overflowY: "scroll", overflowX: "hidden", height: "360px", position: 'relative' }}
          onScroll={(e) => {
            e.stopPropagation();
            debounce(() => {
              setPageNo(pageNo + 1);
              getAllNotificationsActions(
                data,
                setData,
                pageNo + 1,
                pageSize,
                employeeId,
                orgId,
                setNotificationLoading
              );
            }, 500);
          }}
        >
          {data?.map((item) => (
            <NotiBodyContent
              key={item?.id}
              content={item}
              buId={buId}
              orgId={orgId}
              handleClose={handleClose}
              setLoading={setLoading}
            />
          ))}
        </div>
        {notficationLoading && <div style={{
          position: 'absolute',
          bottom: '-5px',
          right: '0',
          width: '100%',
          height: '3px',
          margin: '0px',
          padding: '0px'
        }} className="text-center my-5">
          <div>
            <LinearProgress />
          </div>
        </div>}

      </div>
    </Popover>
  );
};

export default NotificationPopUp;
