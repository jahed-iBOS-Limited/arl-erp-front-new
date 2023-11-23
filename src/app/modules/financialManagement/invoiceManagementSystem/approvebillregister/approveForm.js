import React, { useState } from "react";
import InputField from "../../../_helper/_inputField";
import IButton from "../../../_helper/iButton";
import { BillApproved_api } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_helper/_loading";

export default function BillApproveForm({ obj }) {
  const { values, gridItem, gridDataFunc, landingValues, setModalShow } = obj;

  // get profile data from redux store
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const [loading, setLoading] = useState(false);

  const saveHandler = (values) => {
    const modifyGridData = {
      billId: gridItem?.billRegisterId,
      unitId: buId,
      billTypeId: gridItem?.billType,
      approvedAmount: +values?.approveAmount,
      remarks: values?.remarks || "",
    };
    const payload = {
      bill: [modifyGridData],
      row: [],
    };

    BillApproved_api(
      userId,
      payload,
      setLoading,
      gridDataFunc,
      landingValues,
      setModalShow
    );
  };

  return (
    <>
      {loading && <Loading />}
      {landingValues?.status?.value && landingValues?.status?.value === 1 && (
        <div className="row global-form printSectionNone">
          <div className="col-lg-3">
            <label>Approve Amount</label>
            <InputField
              value={values?.approveAmount}
              name="approveAmount"
              placeholder="Approve Amount"
              type="number"
              max={gridItem?.monTotalAmount}
              required
            />
          </div>
          <div className="col-lg-6">
            <label>Remarks</label>
            <InputField
              value={values?.remarks}
              name="remarks"
              placeholder="Remarks"
              type="text"
            />
          </div>
          <IButton
            className={"btn-info"}
            colSize={"col-lg-3"}
            onClick={() => {
              saveHandler(values);
            }}
          >
            Approve
          </IButton>
        </div>
      )}
    </>
  );
}
