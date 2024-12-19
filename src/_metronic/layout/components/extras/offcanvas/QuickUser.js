/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import { DropzoneDialogBase } from 'material-ui-dropzone';
import React, { useState } from 'react';
import SVG from 'react-inlinesvg';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { APIUrl } from '../../../../../app/App';
import {
  Logout,
  saveChatInfoAction,
} from '../../../../../app/modules/Auth/_redux/Auth_Actions';
import { ChatAppPeer, ChatAppSocket } from '../../../../../app/modules/chatApp';
import { setResetDataAction } from '../../../../../app/modules/chatApp/redux/Action';
import { compressfile } from '../../../../../app/modules/_helper/compressfile';
import { clearLocalStorageAction } from '../../../../../app/modules/_helper/reduxForLocalStorage/Actions';
import Loading from '../../../../../app/modules/_helper/_loading';
import { toAbsoluteUrl } from '../../../../_helpers';
import { authSlice } from '../../aside/aside-menu/_redux/BuniessUnitSlice';
import { profileAPiCall, updateProfilePicture, uplaodAttachment } from './api';
const { actions } = authSlice;

export function QuickUser() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  const logoutClick = () => {
    const toggle = document.getElementById('kt_quick_user_toggle');
    if (toggle) {
      /* Disconnect Web Socket And Peer Connection For Chat And Others */
      dispatch(setResetDataAction());
      ChatAppSocket && ChatAppSocket.disconnect();
      ChatAppPeer && ChatAppPeer.disconnect();

      toggle.click();
      dispatch(Logout());
      dispatch(clearLocalStorageAction());
    }

    document.title = 'iBOS | Web App'; // Clear the title
    history.push('/logout');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const { isAuth, profileData } = useSelector((state) => state.authData);

  const profilePicChangeHandler = async () => {
    if (fileObjects.length > 0) {
      const compressedFile = await compressfile(
        fileObjects?.map((f) => f.file),
      );
      setImageUploadModal(false);
      setLoading(true);
      await uplaodAttachment(compressedFile, (data) => {
        const modifyPlyload = {
          userId: profileData?.userId,
          imageUrl: data[0]?.id,
        };
        if (data[0]?.id) {
          updateProfilePicture(modifyPlyload, setLoading, async () => {
            profileData?.emailAddress &&
              (await profileAPiCall(profileData?.emailAddress).then((res) => {
                dispatch(actions.ProfileFetched(res));
                const {
                  emailAddress,
                  userId,
                  accountId,
                  userName,
                } = res?.data[0];
                dispatch(
                  saveChatInfoAction(emailAddress, userName, accountId, userId),
                );
              }));
          });
          setFileObjects([]);
        }
      });
      setLoading(false);
    }
  };

  return (
    <div
      id="kt_quick_user"
      className="offcanvas offcanvas-right offcanvas p-10"
    >
      {loading && <Loading />}
      <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
        <h3 className="font-weight-bold m-0">
          User Profile
          {/* <small className="text-muted font-size-sm ml-2">12 messages</small> */}
        </h3>
        <button
          className="btn btn-xs btn-icon btn-light"
          id="kt_quick_user_close"
        >
          <i
            class="far fa-times-circle"
            style={{ fontSize: '15px', marginLeft: '5px' }}
          ></i>
        </button>
      </div>

      <div className="offcanvas-content pr-5 mr-n5">
        <div className="d-flex align-items-center mt-5">
          <div
            style={{ position: 'relative' }}
            className="symbol symbol-100 mr-5"
          >
            <div className="symbol-label" />
            <img
              style={{
                width: '100px',
                height: '100px',
                position: 'absolute',
                top: '0',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              alt="logo"
              src={
                profileData?.userImageFile
                  ? `${APIUrl}/domain/Document/DownlloadFile?id=${profileData?.userImageFile}`
                  : toAbsoluteUrl('/media/logos/ibos.png')
              }
            />
            <i className="symbol-badge bg-success" />
          </div>
          <div className="d-flex flex-column">
            <a
              href="#"
              className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary"
            >
              {profileData?.userName}
            </a>
            {profileData?.designationName ? (
              <div style={{ fontSize: '12px' }} className="text-muted mt-0">
                {profileData?.designationName || ''}
              </div>
            ) : null}
            <div className="navi">
              <a href="#" className="navi-item">
                <span className="navi-link p-0 pb-2">
                  {/* <span className="navi-icon mr-1">
                    <span className="svg-icon-lg svg-icon-primary">
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/Communication/Mail-notification.svg"
                        )}
                      ></SVG>
                    </span>
                  </span> */}
                  <span className="navi-text text-hover-primary text-info">
                    {profileData?.emailAddress}
                  </span>
                </span>
              </a>
            </div>
            {/* <Link to="/logout" className="btn btn-light-primary btn-bold">
                Sign Out
              </Link> */}
            <button
              type="button"
              onClick={() => {
                setImageUploadModal(true);
              }}
              className="btn btn-light-success btn-bold btn-sm"
            >
              Change Picture
              <i className="fas fa-camera ml-2" />
            </button>
          </div>
        </div>

        <div className="d-flex">
          <button
            className="btn btn-light-primary btn-bold w-100 mt-8"
            onClick={logoutClick}
          >
            Sign out
          </button>
        </div>
      </div>

      <DropzoneDialogBase
        filesLimit={1}
        acceptedFiles={['image/*', 'application/pdf']}
        fileObjects={fileObjects}
        cancelButtonText={'cancel'}
        submitButtonText={'submit'}
        maxFileSize={10000000}
        open={imageUploadModal}
        onAdd={(newFileObjs) => {
          setFileObjects([].concat(newFileObjs));
        }}
        onDelete={(deleteFileObj) => {
          const newData = fileObjects.filter(
            (item) => item.file.name !== deleteFileObj.file.name,
          );
          setFileObjects(newData);
        }}
        onClose={() => setImageUploadModal(false)}
        onSave={() => {
          profilePicChangeHandler();
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  );
}
