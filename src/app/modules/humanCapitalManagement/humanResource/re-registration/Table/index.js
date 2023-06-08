/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import HeaderForm from "./form";
import { useHistory } from "react-router-dom";
import { employeeBasicInformation_landing_api } from "./../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

export default function ReRegistrationLanding() {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const history = useHistory();

  const createHandler = () => {
    history.push("/human-capital-management/humanresource/employee-info/add");
  };

  return (
    <>
      <HeaderForm createHandler={createHandler} />
    </>
  );
}
