import React, { useState, useEffect } from "react";
import Form from "./form";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import Loading from "../../../../../../_helper/_loading";
import {
  createEmployeeSettings,
  GetEmployeeProfileSettingById_api,
} from "../../../helper";
import { useLocation } from "react-router-dom";
import { _todayDate } from "../../../../../../_helper/_todayDate";

const initData = {
  id: undefined,
};
export default function OtherInformationForm({
  title,
  rowFormData,
  singleData,
  sectionCardId,
  setSingleData,
}) {
  // eslint-disable-next-line no-unused-vars
  // const [singleData, setSingleData] = useState("");
  const [edit, setEdit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let payload = rowFormData.map((itm) => {
        var name = itm?.strAttributeName;

        return {
          intEmployeeSettingId: 0,
          intEmployeeId: headerData?.employeeId,
          intProfileSectionId: itm?.intSectionId,
          strProfileSection: itm?.strSectionName,
          intAttributeId: itm?.intAttributeid,
          strControlType: itm?.strControlType,
          intSectionAttributeId: itm?.intSectionId,
          strSectionAttributeValue:
            itm?.strControlType === "DDL" ? values[name]?.label : values[name],
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          isActive: true,
          intActionBy: profileData?.userId,
          dteLastActionDateTime: _todayDate(),
          dteServerDateTime: _todayDate(),
        };
      });

      const customCallback= () => {
        cb();
        GetEmployeeProfileSettingById_api(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          headerData?.employeeId,
          sectionCardId,
          setSingleData
        );
      }
      createEmployeeSettings(payload, setDisabled, customCallback);
      
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (singleData > 0) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [singleData]);

  console.log("singleData", singleData);

  return (
    <div className="Otehr Information">
      {isDisabled && <Loading />}
      <Form
        initData={initData}
        setEdit={setEdit}
        edit={edit}
        saveHandler={saveHandler}
        isDisabled={isDisabled}
        title={title}
        rowFormData={rowFormData}
        singleData={singleData}
      />
    </div>
  );
}
