/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";

import {
  fetchSingleData,
  getBonusNameDDL,
  getReligionDDL,
  getEmploymentTypeDDL,
  fetchLandingData,
  createData,
  editSingleData,
} from "../helper/Actions";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";

let initData = {
  bonusName: "",
  bonusDescription: "",
  religion: "",
  employeeType: "",
  servicelength: "",
  bonusPercentageOn: "",
  bonusPercentage: "",
};

export function BonusSetupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const [singleDataState, setSingleDataState] = useState([]);
  const [religionDDL, setReligionDDL] = useState([]);
  const [employeeTypeDDL, setEmployeeTypeDDL] = useState([]);
  const [bonusNameDDL, setBonusNameDDL] = useState([]);

  const [rowData, setRowData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Position Group DDL
  useState(() => {
    getReligionDDL(setReligionDDL);
  }, []);

  // Get Position Group DDL
  useState(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBonusNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        1,
        setBonusNameDDL
      );
      getEmploymentTypeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeTypeDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // Get Landing Pasignation Data
  useEffect(() => {
    fetchLandingData(
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setRowData,
      setDisabled
    );
  }, []);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    fetchLandingData(
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setRowData,
      setDisabled,
      searchValue
    );
  };

  // Get Single Data
  useEffect(() => {
    if (id) {
      fetchSingleData(id, setSingleDataState);
    }
  }, []);

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        let payload = {
          accountId: profileData?.accountId,
          bonusSetupId: +id,
          bonusId: values?.bonusName?.value,
          bonusName: values?.bonusName?.label,
          bonusDescription: values?.bonusName?.description,
          religionId: values?.religion?.value,
          religion: values?.religion?.label,
          employmentTypeId: values?.employeeType?.value,
          employmentType: values?.employeeType?.label,
          minimumServiceLengthMonth: values?.servicelength || 0,
          bonusPercentageOn: values?.bonusPercentageOn?.label,
          bonusPercentage: values?.bonusPercentage || 0,
          actionBy: profileData?.userId,
          lastActionDateTime: _todayDate(),
          isActive: true,
        };

        const callbackFunc = () => {
          cb();
          fetchLandingData(
            selectedBusinessUnit?.value,
            pageNo,
            pageSize,
            setRowData,
            setDisabled
          );
          if (id) {
            fetchSingleData(id, setSingleDataState);
          }
        };
        editSingleData(payload, callbackFunc, setDisabled);
      } else {
        let payload = {
          accountId: profileData?.accountId,
          bonusId: values?.bonusName?.value,
          bonusName: values?.bonusName?.label,
          bonusDescription: values?.bonusName?.description,
          religionId: values?.religion?.value,
          religion: values?.religion?.label,
          employmentTypeId: values?.employeeType?.value,
          employmentType: values?.employeeType?.label,
          minimumServiceLengthMonth: values?.servicelength || 0,
          bonusPercentageOn: values?.bonusPercentageOn?.label,
          bonusPercentage: values?.bonusPercentage || 0,
          actionBy: profileData?.userId,
          lastActionDateTime: _todayDate(),
          isActive: true,
        };

        const callbackFunc = () => {
          cb();
          fetchLandingData(
            selectedBusinessUnit?.value,
            pageNo,
            pageSize,
            setRowData,
            setDisabled
          );
        };

        createData(payload, callbackFunc, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Bonus Setup" : "Create Bonus Setup"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={id}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singleDataState : initData}
          saveHandler={saveHandler}
          isEdit={id}
          religionDDL={religionDDL}
          employeeTypeDDL={employeeTypeDDL}
          bonusNameDDL={bonusNameDDL}
          singleDataState={singleDataState}
          rowData={rowData}
          setPositionHandler={setPositionHandler}
          pageNo={pageNo}
          setPageNo={setPageNo}
          pageSize={pageSize}
          setPageSize={setPageSize}
          loader={isDisabled}
        />
      </div>
    </IForm>
  );
}
