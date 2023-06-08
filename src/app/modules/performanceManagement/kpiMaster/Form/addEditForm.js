import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import Form from "./form";

let initData = {
  bscPerspective: "",
  kpi: "",
  status: "",
};

export function KpiMasterForm() {
  const [isDisabled] = useState(false);
  const [, saveData] = useAxiosPost();
  const location = useLocation();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    saveData(
      `/pms/KPI/CreateEditKPIMasterData`,
      {
        intKpiMasterId: location?.state?.item?.intKpiMasterId
          ? location?.state?.item?.intKpiMasterId
          : 0,
        strKpiMasterName: values?.kpi,
        strKpiMasterCode: "",
        intBscPerspectiveId: values?.bscPerspective?.value,
        strBscPerspectiveName: values?.bscPerspective?.label,
        intAccountId: profileData?.accountId,
        isActive: location?.state?.item?.intKpiMasterId
          ? values?.status?.value === 1
            ? true
            : false
          : true,
        intActionBy: profileData?.userId,
        dteLastActionDateTime: _todayDate(),
      },
      cb,
      true
    );
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={
        location?.state?.item?.intKpiMasterId
          ? "Edit KPI Master Data"
          : "Create KPI Master Data"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          editData={location?.state?.item}
        />
      </div>
    </IForm>
  );
}
