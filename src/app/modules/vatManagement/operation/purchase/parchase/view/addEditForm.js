import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { getSinglePurchaseview, GetPurchaseLogDetails_api } from "./../helper";
import moment from "moment";
const initData = {
  supplier: "",
  address: "",
  transactionDate: _todayDate(),
  tradeType: "",
  paymentTerm: "",
  vehicalInfo: "",
  refferenceNo: "",
  refferenceDate: _todayDate(),
  totalTdsAmount: "",
  totalVdsAmount: "",
  selectedItem: "",
  selectedUom: "",
  quantity: "",
  rate: "",
  totalAtv: "",
  totalAit: "",
};

export default function PurchaseView({ viewClick, redirectAuditLogPage }) {
  const [singleData, setSingleData] = useState("");
  const [isDisabled, setDisabled] = useState(true);
  const [
    objProps,
    //  setObjprops
  ] = useState({});
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (redirectAuditLogPage?.logId) {
      GetPurchaseLogDetails_api(
        redirectAuditLogPage?.logId,
        setSingleData,
        setRowDto,
        setDisabled
      );
    } else {
      if (viewClick?.taxPurchaseId) {
        getSinglePurchaseview(
          viewClick?.taxPurchaseId,
          setSingleData,
          setRowDto,
          setDisabled
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {redirectAuditLogPage?.logId && (
        <div className="mt-8">
          <p className="p-0 m-0">
            <b>Activity</b>: {singleData?.activity}{" "}
          </p>
          <p className="p-0 m-0">
            <b>Action Date/Time</b>:{" "}
            {moment(singleData?.auditLog?.activityTime).format(
              "DD-MMM-YY, LTS"
            )}
          </p>
        </div>
      )}

      <Form
        {...objProps}
        initData={
          viewClick?.taxPurchaseId || redirectAuditLogPage?.logId
            ? singleData
            : initData
        }
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={
          viewClick?.taxPurchaseId || redirectAuditLogPage?.logId || false
        }
        setRowDto={setRowDto}
        rowDto={rowDto}
        isDisabled={isDisabled}
      />
    </>
  );
}
