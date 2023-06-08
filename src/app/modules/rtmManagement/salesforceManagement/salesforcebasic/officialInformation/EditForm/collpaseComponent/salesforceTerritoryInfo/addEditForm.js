/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Form from "./form";
import {
  getSalesForceTerritory,
  getDistributionChannelDDL,
  getTerritoryTypeDDL,
  createSalesForceTerritory,
} from "./helper";
import { _todayDate } from "../../../../../../../_helper/_todayDate";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Loading from "../../../../../../../_helper/_loading";
const initData = {
  territoryType: "",
  territory: "",
  distributionChannel: "",
  section: "",
  region: "",
  area: "",
  point: "",
};

export default function SalesforceTerrioryInfo() {
  const [edit, setEdit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();

  // ddl
  const [territoryTypeDDL, setTerritoryTypeDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [singleData, setSingleData] = useState("");
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    getDistributionChannelDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributionChannelDDL
    );
    getTerritoryTypeDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTerritoryTypeDDL
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      headerData?.employeeId
    ) {
      getSalesForceTerritory(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        headerData?.employeeId,
        setSingleData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, headerData]);

  useEffect(() => {
    if (singleData) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (singleData) {
        toast.warning("No Edit Option");
        setDisabled(false);
      } else {
        const payload = {
          configId: 0,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          territoryTypeId: values?.territoryType?.value, // Assign by Iftakhar Alam
          territoryId: values?.territory?.value, // Assign by Iftakhar Alam
          territoryName: values?.territory?.label, // Assign by Iftakhar Alam
          territoryCode: "not imp",
          distributionChannelId: values?.distributionChannel?.value,
          employeeId: headerData?.employeeId,
          employeeCode: headerData?.employeeCode,
          employeeName: headerData?.employeeFirstName,
          email: "string",
          ysnManager: true,
          actionBy: profileData?.userId,
        };
        // console.log("Payload =>", payload);
        createSalesForceTerritory(payload, cb, setDisabled, () => {
          getSalesForceTerritory(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            headerData?.employeeId,
            setSingleData
          );
        });
      }
    } else {
      setDisabled(false);
    }
  };

  // useEffect(() => {
  //   if (edit) {
  //     getNationalityDDL(setNationalityDDL);
  //     getBloodGroupDDL(setBloodGroupDDL);
  //     getGenderDDL(setGenderDDL);
  //     getEmpIdentificationTypeDDL(setIdentificationTypeDDL);
  //     religionDDL_api(setReligionDDL);
  //     getMeritalStatusDDL_api(setMeritalStatusDDL);
  //   }
  // }, [edit]);

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={singleData || initData}
        saveHandler={saveHandler}
        setEdit={setEdit}
        edit={edit}
        isDisabled={isDisabled}
        singleData={singleData}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        territoryTypeDDL={territoryTypeDDL}
        distributionChannelDDL={distributionChannelDDL}
      />
    </div>
  );
}
