import React, { useEffect, useState } from "react";
import "./style.scss";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createERPUserInfoAcion } from "../_redux/Actions";

function MobileFirstAlert() {
  const [isShowAlert, setIsShowAlert] = useState(false);
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    // window view not mobile than api call
    if (window.innerWidth > 768 && process.env.NODE_ENV !== "development") {
      setIsShowAlert(true);
      // 5s delay for alert hide
      setTimeout(() => {
        setIsShowAlert(false);
      }, 5000);
      const payload = [
        {
          userEnroll: profileData?.employeeId,
          isActive: true,
        },
      ];
      dispatch(createERPUserInfoAcion(payload));
    }else {
      setIsShowAlert(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isShowAlert ? (
        <div className="MobileFirstAlertWrapper">
          <div className="MobileFirstAlert">
            <div>
              Our values is <b>Mobile First</b>. Please use your <b>Mobile</b>.
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MobileFirstAlert;
