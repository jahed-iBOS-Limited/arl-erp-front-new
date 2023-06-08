/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import HeaderForm from "./form";
import { useHistory } from "react-router-dom";
import { employeeBasicInformation_landing_api } from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { getempInfoGridforOwnView } from "../../employeeInformation/helper";

export default function BasicInformationlLanding() {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let personalInfo = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 93) {
      personalInfo = userRole[i];
    }
  }

  const [rowDto, setRowDto] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [loader, setLoader] = useState(false);

  const history = useHistory();

  const createHandler = () => {
    history.push("/human-capital-management/humanresource/personal-info/add");
  };

  useEffect(() => {
    if (personalInfo?.isView) {
      employeeBasicInformation_landing_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRowDto,
        pageNo,
        pageSize,
        setLoader
      );
    } else {
      getempInfoGridforOwnView(setRowDto, setLoader, profileData?.employeeId);
    }
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    employeeBasicInformation_landing_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRowDto,
      pageNo,
      pageSize,
      setLoader,
      searchValue
    );
  };

  return (
    <>
      <HeaderForm
        rowDto={rowDto}
        createHandler={createHandler}
        setPositionHandler={setPositionHandler}
        pageNo={pageNo}
        setPageNo={setPageNo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        loader={loader}
      />
    </>
  );
}
