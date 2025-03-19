import React, { useEffect, useState } from "react";
import HeaderForm from "./Landing/form";
import "./index.css";
import ICustomCard from "../../../_helper/_customCard";
import orderLogo from "../../../_helper/images/order.svg";
import findIndex from "../../../_helper/_findIndex";

import { shallowEqual, useSelector } from "react-redux";
import { getActivityCounter } from "./helper";
import { useLocation } from "react-router-dom";
export default function PurchaseOrder() {
  const location = useLocation();
  const estimatePDAPOPage = location?.state || "";
  const { profileData } = useSelector((state) => state.authData, shallowEqual);
  const authData = useSelector((state) => state.authData, shallowEqual);

  const selectedBusinessUnit = estimatePDAPOPage?.values?.businessUnit?.value
    ? estimatePDAPOPage?.values?.businessUnit
    : authData?.selectedBusinessUnit;

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const [activityCount, setActivityCount] = useState("");
  const featureData = userRole[findIndex(userRole, "Purchase Order")];

  useEffect(() => {
    // /domain/Activity/ActivityCounter?businessUnitId=164&activityId=1&userId=1205
    getActivityCounter(
      selectedBusinessUnit?.value,
      featureData?.intFeatureId,
      profileData?.userId,
      setActivityCount
    );
  }, [profileData, selectedBusinessUnit, featureData]);
  return (
    <div style={{ height: "100%" }} className='purchase-order'>
      {/* <ITableTwo
        renderProps={() => <HeaderForm />}
        title="Purchase Order"
        viewLink=""
        isHidden={true}
        createLink="/mngProcurement/purchase-management/purchaseorder/create/po"
      >
        <GridData />
      </ITableTwo> */}
      <ICustomCard
        title='Purchase Order'
        // createHandler={() =>
        //   history.push(
        //     `/mngProcurement/purchase-management/purchaseorder/create/po`
        //   )
        // }
      >
        <div
          className=''
          style={{
            position: "absolute",
            top: "32px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div className='d-flex align-items-center'>
            <div className='d-flex align-items-center mr-2'>
              <img
                src={orderLogo}
                alt='logo'
                style={{ margin: "0 0.5rem 0 0" }}
              />
              <h6 style={{ fontSize: "16px", margin: "0 0.5rem 0 0" }}>
                {activityCount?.[0]?.qunatity}
              </h6>
              <span style={{ fontSize: "12px", color: "gray" }}> Quantity</span>
            </div>
            <div className='d-flex align-items-center'>
              <img
                src={orderLogo}
                alt='logo'
                style={{ margin: "0 0.5rem 0 0" }}
              />
              <h6 style={{ fontSize: "16px", margin: "0 0.5rem 0 0" }}>
                {activityCount?.[0]?.amount}
              </h6>
              <span style={{ fontSize: "12px", color: "gray" }}> Amount</span>
            </div>
            <div className='ml-6'>
              {estimatePDAPOPage && (
                <>
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    <h6>Estimate PDA</h6>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <HeaderForm selectedBusinessUnit={selectedBusinessUnit} estimatePDAPOPage={estimatePDAPOPage}/>
      </ICustomCard>
    </div>
  );
}
