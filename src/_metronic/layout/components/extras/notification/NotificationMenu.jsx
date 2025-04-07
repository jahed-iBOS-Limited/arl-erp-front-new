import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import NotificationPopUp from './NotificationPopUp';
import { getAllNotificationsActions } from './helper';
import { useDispatch } from 'react-redux';
import { NotificationsNoneOutlined } from '@mui/icons-material';
import { setNotifyCountAction } from '../../../../../app/modules/_helper/chattingAppRedux/Action';

export default function NotificationMenu({ myCount }) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const employeeId = profileData?.employeeId;
  const orgId = profileData?.accountId;
  const buId = selectedBusinessUnit?.value;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setPageNo(1);
    setData([]);
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <div
        className="top-user pointer notification-bell"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setNotifyCountAction(0));
          getAllNotificationsActions(
            data,
            setData,
            pageNo,
            pageSize,
            employeeId,
            orgId
          );
          handleClick(e);
        }}
      >
        <span>
          <NotificationsNoneOutlined
            sx={{
              color: 'action.active',
              zIndex: 1,
            }}
          />
        </span>
        {myCount > 0 && (
          <span id="notiCount" className="badge">
            {myCount}
          </span>
        )}
      </div>

      {/* notification */}
      <NotificationPopUp
        propsObj={{
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
          setPageSize,
          setLoading,
        }}
      />
    </>
  );
}
