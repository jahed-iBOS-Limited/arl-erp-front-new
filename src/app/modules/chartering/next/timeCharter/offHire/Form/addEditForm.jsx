/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import moment from "moment";
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams, useLocation, useHistory } from "react-router";
import Loading from "../../../../_chartinghelper/loading/_loading";
import { createOffHire } from "../helper";
import Form from "./form";

const date = new Date();

const initData = {
  vesselName: "",
  voyageNo: "",
  offHireReason: "",
  offHireStartDateTime: moment(date).format("yyyy-MM-DDTHH:mm"),
  offHireEndDateTime: moment(date).format("yyyy-MM-DDTHH:mm"),
  offHireDuration: "",
  durationPercentage: "",
  offHireCostAmount: "",
  perDayLsmgoQty: "",
  offHireLsmgoqty: "",
  offHireLsmgorate: "",
  offHireLsmgovalue: "",
  perDayLsfoQty: "",
  offHireLsfoqty: "",
  offHireLsforate: "",
  offHireLsfovalue: "",
  offHireCve: "",
  otherCost: "",
  finalOffHireDuration: "",
  offHireAddressCommission: "",
  offHireBrokerCommission: "",
};

export default function NextOffHireForm() {
  const { type } = useParams();
  const { state: preData } = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    const payload = {
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageId: values?.voyageNo?.value,
      voyageNumber: values?.voyageNo?.label,
      offHireReason: values?.offHireReason,
      offHireStartDateTime: values?.offHireStartDateTime,
      offHireEndDateTime: values?.offHireEndDateTime,
      durationPercentage: values?.durationPercentage,
      offHireCostAmount: values?.offHireCostAmount,
      offHireDuration: values?.offHireDuration,
      perDayLsmgoQty: values?.perDayLsmgoQty,
      offHireLsmgoqty: values?.offHireLsmgoqty,
      offHireLsmgorate: values?.offHireLsmgorate,
      offHireLsmgovalue: values?.offHireLsmgovalue,
      perDayLsfoQty: values?.perDayLsfoQty,
      offHireLsfoqty: values?.offHireLsfoqty,
      offHireLsforate: values?.offHireLsforate,
      offHireLsfovalue: values?.offHireLsfovalue,
      offHireCve: values?.offHireCve,
      otherCost: values?.otherCost,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      insertby: profileData?.userId,
      addressCommision: values?.offHireAddressCommission,
      offHireFinalDuration: values?.finalOffHireDuration,
      brokarageCommision: values?.offHireBrokerCommission,
    };
    createOffHire(payload, setLoading, () => {
      cb();
      history.push({
        pathname: `/chartering/transaction/timecharter/create`,
        state: preData,
      });
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title="Create Off Hire"
        initData={{
          ...initData,
          ...preData,
          offHireLsmgorate: preData?.lsmgoRate,
          offHireLsforate: preData?.lsfo1Rate,
        }}
        saveHandler={saveHandler}
        viewType={type}
        preData={preData}
      />
    </>
  );
}
