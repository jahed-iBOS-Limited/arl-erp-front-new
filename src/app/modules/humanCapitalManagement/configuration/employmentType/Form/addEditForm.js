/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";

import {
  fetchSingleData,
  createData,
  // getDDL,
  editSingleData,
} from "../helper/Actions";
import Loading from "../../../../_helper/_loading";

let initData = {
  // employmentType: "",
  businessUnit: "",
  isConsolidated: false,
};

export function EmploymentTypeForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const location = useLocation();

  const [singleDataState, setSingleDataState] = useState([]);
  // const [businessUnitDDL, setBusinessUnitDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Business Unit DDL
  // useState(() => {
  //   getDDL(`/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData.accountId}`, setBusinessUnitDDL);
  // }, []);

  // Get Single Data
  useEffect(() => {
    if (id) {
      fetchSingleData(id, location.state, setSingleDataState);
    }
  }, []);

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        let editData = {
          employmentTypeId: +id,
          employmentType: values.employmentType,
          isConsolidated: values?.isConsolidated,
          actionBy: profileData?.userId,
        };
        editSingleData(editData, setDisabled);
      } else {
        let saveData = {
          employmentType: values?.employmentType,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          isConsolidated: values?.isConsolidated,
          actionBy: profileData?.userId,
        };
        createData(saveData, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Employment Type" : "Create Employment Type"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={id ? true : false}
    >
      {isDisabled && <Loading />}
      <div className="py-4 global-form">
        <Form
          {...objProps}
          initData={id ? singleDataState : initData}
          saveHandler={saveHandler}
          isEdit={id ? true : false}
          // businessUnitDDL={businessUnitDDL}
        />
      </div>
    </IForm>
  );
}
