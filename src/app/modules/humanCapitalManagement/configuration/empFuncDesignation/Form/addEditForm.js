/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";

import {
  singleDataById,
  editSingleData,
  createData,
  getDDL,
} from "../helper/Actions";
import Loading from "../../../../_helper/_loading";

const initData = {
  designationName: "",
  designationCode: "",
  // businessUnit: "",
  position: "",
};

// let singleData;

export function EmpFuncDesgForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleDataState, setSingleDataState] = useState("");
  // const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [positiontDDL, setPositiontDDL] = useState([]);

  // const location = useLocation();

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
  //   getDDL(
  //     `hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData.accountId}`,
  //     setBusinessUnitDDL
  //   );
  // }, []);

  // Get Deperment DDL
  useState(() => {
    getDDL(
      `/hcm/HCMDDL/GetPositionWithAccountIdDDL?AccountId=${profileData.accountId}`,
      setPositiontDDL
    );
  }, []);

  // Get Single Data
  useEffect(() => {
    if (id) {
      singleDataById(id, setSingleDataState);
    }
  }, [id]);

  // if (id) {
  //   singleData = {
  //     designationName: singleDataState?.designationName,
  //     designationCode: singleDataState?.designationCode,
  //     businessUnit: location?.state.businessUnit,
  //     department: location?.state.department,
  //     position: {
  //       value: singleDataState?.positionId,
  //       label: singleDataState?.positionName,
  //     }
  //   };
  // }

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        let editData = {
          designationId: +id,
          designationName: values?.designationName,
        };
        editSingleData(editData, setDisabled);
      } else {
        let saveData = {
          designationCode: values?.designationCode,
          designationName: values?.designationName,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          positionId: values?.position?.value,
          positionName: values?.position?.label,
          remarks: "string",
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
      title={id ? "Edit Designation" : "Create Designation"}
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
          positiontDDL={positiontDDL}
        />
      </div>
    </IForm>
  );
}
