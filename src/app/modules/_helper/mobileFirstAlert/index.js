import React, { useEffect, useState } from "react";
import "./style.scss";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createERPUserInfoAcion } from "../_redux/Actions";

function MobileFirstAlert() {
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const dispatch = useDispatch();

  const isMatchWorkPlaceMatch = [
    40,
    49,
    52,
    94,
    237,
    240,
    271,
    300,
    422,
    600,
    611,
    269,
  ].includes(profileData?.workPlaceId);

  useEffect(() => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileUser = /android|iPad|iPhone|iPod|Opera Mini|IEMobile|WPDesktop|Windows Phone/i.test(
      userAgent
    );

    if (!isMobileUser ) {
      setIsShowAlert(true);
      if (isMatchWorkPlaceMatch) {
        // 20m delay for alert hide
        setTimeout(() => {
          setIsShowAlert(false);
        }, 1200000);
      } else {
        // 5s delay for alert hide
        setTimeout(() => {
          setIsShowAlert(false);
        }, 5000);
      }
      const payload = [
        {
          userEnroll: profileData?.employeeId,
          isActive: true,
        },
      ];
      dispatch(createERPUserInfoAcion(payload));
    } else {
      setIsShowAlert(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClose = () => {
    setIsShowAlert(false);
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsShowAlert(false);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const isShowBUIMatch = [184].includes(profileData?.defaultBusinessUnit);
  const isMatchEmployeeId = [1187, 1039].includes(profileData?.employeeId);
  const isEmpSuplier =
    [2].includes(profileData?.userTypeId) && profileData?.workPlaceId === 269;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    var userAgent = undefined;
    const isMobileUser = /android|iPad|iPhone|iPod|Opera Mini|IEMobile|WPDesktop|Windows Phone/i.test(
      userAgent
    );
    const leftTime = timeLeft > 0;
    if (
      !isMobileUser &&
      leftTime &&
      !isShowBUIMatch &&
      isMatchWorkPlaceMatch &&
      !isMatchEmployeeId &&
      !isEmpSuplier
    ) {
      setIsShowAlert(true);
    }
  });

  return (
    <>
      {isShowAlert ? (
        <div className="MobileFirstAlertWrapper">
          <div className="MobileFirstAlert">
            <div>
              Our values is <b>Mobile First</b>. Please use your <b>Mobile</b>.
            </div>
            {isMatchWorkPlaceMatch && (
              <div className="countdown">Time left: {formatTime(timeLeft)}</div>
            )}

            {(!isMatchWorkPlaceMatch ||
              isShowBUIMatch ||
              isEmpSuplier ||
              isMatchEmployeeId) && (
              <div className="close-icon" onClick={handleClose}>
                &times;
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MobileFirstAlert;
