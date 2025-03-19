/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams, useLocation, useHistory } from "react-router";
import Loading from "../../../../_chartinghelper/loading/_loading";
import { createBallastPassage } from "../helper";
import Form from "./form";

const initData = {
  vesselName: "",
  voyageNo: "",
  ballastStartDate: "",
  ballastEndDate: "",
  ballastDuration: "",
  lsmgoperDayQty: "",
  lsmgoballastQty: "",
  lsmgoballastRate: "",
  lsmgoballastAmount: "",
  lsfoperDayQty: "",
  lsfoballastQty: "",
  lsfoballastRate: "",
  lsfoballastAmount: "",
};

export default function NextBallastPassageForm() {
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
      ballastId: 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageId: values?.voyageNo?.value,
      voyageNo: values?.voyageNo?.label,
      ballastStartDate: values?.ballastStartDate,
      ballastEndDate: values?.ballastEndDate,
      ballastDuration: values?.ballastDuration,
      lsmgoperDayQty: +values?.lsmgoperDayQty,
      lsmgoballastQty: +values?.lsmgoballastQty,
      lsmgoballastRate: +values?.lsmgoballastRate,
      lsmgoballastAmount: +values?.lsmgoballastAmount,
      lsfoperDayQty: +values?.lsfoperDayQty,
      lsfoballastQty: +values?.lsfoballastQty,
      lsfoballastRate: +values?.lsfoballastRate,
      lsfoballastAmount: +values?.lsfoballastAmount,
      actionBy: profileData.actionBy,
    };
    createBallastPassage(payload, setLoading, () => {
      cb();
      history.push({
        pathname: `/chartering/next/expense`,
        state: preData,
      });
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title="Create Ballast Passage"
        initData={{
          ...initData,
          ...preData,
          lsfoballastRate: preData?.lsfo1Rate,
          lsmgoballastRate: preData?.lsmgoRate,
        }}
        saveHandler={saveHandler}
        viewType={type}
        preData={preData}
      />
    </>
  );
}
