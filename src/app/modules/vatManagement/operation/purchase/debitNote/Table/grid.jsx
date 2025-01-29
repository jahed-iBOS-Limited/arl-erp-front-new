import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import PrintFormetReportDebitNote from "./printFormetReportDebitNote";
import {
  getDebitNoteReport_api,
  GetDebitNoteLogDetails_api,
} from "./../helper/helper";
import moment from "moment";
const DebitNoteView = ({ viewClick, title, redirectAuditLogPage }) => {
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      purchaseDebitNoteLanding: state.localStorage.purchaseDebitNoteLanding,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    const purchaseId =
      viewClick?.taxPurchaseId ||
      viewClick?.purchaseId ||
      viewClick?.PurchaseId;
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      (purchaseId || redirectAuditLogPage?.logId)
    ) {
      if (redirectAuditLogPage?.logId) {
        GetDebitNoteLogDetails_api(
          redirectAuditLogPage?.logId,
          setSingleData,
          setLoading
        );
      } else {
        getDebitNoteReport_api(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          purchaseId,
          setSingleData,
          setLoading
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, viewClick]);
  return (
    <>
      {redirectAuditLogPage?.logId && (
        <div className="mt-8">
          <p className="p-0 m-0">
            <b>Activity</b>: {singleData?.auditLog?.activity}{" "}
          </p>
          <p className="p-0 m-0">
            <b>Action Date/Time</b>:{" "}
            {moment(singleData?.auditLog?.activityTime).format(
              "DD-MMM-YY, LTS"
            )}
          </p>
        </div>
      )}

      <PrintFormetReportDebitNote
        singleData={singleData}
        profileData={profileData}
        viewClick={viewClick}
        title={title}
        loading={loading}
      />
    </>
  );
};

export default DebitNoteView;
