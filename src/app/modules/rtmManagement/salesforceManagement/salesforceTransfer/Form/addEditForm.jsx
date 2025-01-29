/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams, useLocation } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { saveSalesforceTransferAction } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  employeeName: "",
  existingTerritoryName: "",
  existingDistributionChannel: "",
  territoryName: "",
  distributionChannel: "",
  territoryTypeName: "",
};

export default function SalesforceTranferForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const params = useParams();
  const location = useLocation();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          territoryId: values?.territoryName?.value,
          territoryName: values?.territoryName?.label,
          territoryCode: values?.territoryName?.code,
          distributionChanelId: values?.distributionChannel?.value,
          employeeId: location?.state?.employee?.value,
          employeeCode: location?.state?.employee?.code,
          employeeName: location?.state?.employee?.label,
          fromDate: _todayDate(),
          todate: _todayDate(),
          actionBy: profileData?.userId,
        };
        saveSalesforceTransferAction(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <IForm
      title={"Create Salesforce Transfer"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        location={location?.state}
        // isEdit={id || false}
      />
    </IForm>
  );
}
