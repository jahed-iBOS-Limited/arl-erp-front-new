/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import HeaderForm from "./form";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { employeeBasicInformation_Pagingation } from "../helper";

export default function OtherInfolLanding() {
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [rowDto, setRowDto] = useState([]);

  const history = useHistory();

  // const createHandler = () => {
  //   history.push("/human-capital-management/humanresource/official-info/add");
  // };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      employeeBasicInformation_Pagingation(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRowDto,
        setLoading,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    employeeBasicInformation_Pagingation(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRowDto,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };
  return (
    <>
      <HeaderForm
        rowDto={rowDto}
        // createHandler={createHandler}
        loading={loading}
        setPositionHandler={setPositionHandler}
        pageNo={pageNo}
        pageSize={pageSize}
        setPageNo={setPageNo}
        setPageSize={setPageSize}
      />
    </>
  );
}
