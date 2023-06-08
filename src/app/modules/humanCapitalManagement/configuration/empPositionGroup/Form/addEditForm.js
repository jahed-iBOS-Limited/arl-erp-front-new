/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";

import {
  fetchSingleData,
  getDDL,
  createData,
  editSingleData,
} from "../helper/Actions";
import Loading from "../../../../_helper/_loading";

let initData = {
  employeePositionGroup: "",
  code: "",
};

export function EmpPositionGroupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const [singleDataState, setSingleDataState] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  // Get Position Group DDL
  useState(() => {
    getDDL("/hcm/HCMDDL/GetPositionDDL", setBusinessUnitDDL);
  }, []);

  // Get Single Data
  useEffect(() => {
    if (id) {
      fetchSingleData(id, setSingleDataState);
    }
  }, []);

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        let data = [
          {
            positionGroupId: +id,
            positionGroupCode: values?.code,
            positionGroupName: values.employeePositionGroup,
            actionBy: profileData?.userId,
            accountId: profileData?.accountId,
          },
        ];
        editSingleData(data, setDisabled);
      } else {
        let data = [
          {
            positionGroupCode: values.code,
            positionGroupName: values.employeePositionGroup,
            accountId: profileData?.accountId,
            actionBy: profileData?.userId,
          },
        ];

        createData(data, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Position Group" : "Create Position Group"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={id}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={
            id
              ? {
                  employeePositionGroup: singleDataState[0]?.positionGroupName,
                  code: singleDataState[0]?.positionGroupCode,
                }
              : initData
          }
          saveHandler={saveHandler}
          isEdit={id}
          employeePositionDDL={businessUnitDDL}
          singleDataState={singleDataState}
        />
      </div>
    </IForm>
  );
}
