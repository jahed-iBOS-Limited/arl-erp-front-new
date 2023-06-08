/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getWorkplaceDDL_api, getYearDDLForProcessReport } from "../helper";

const statusDDL = [
  { value: -1, label: "All" },

  { value: 0, label: "Not Processed" },
];

const currentMonthInitData = () => {
  let month = new Date().getMonth();
  let option = "";
  switch (month) {
    case 0:
      option = { value: 1, label: "January" };
      break;
    case 1:
      option = { value: 2, label: "February" };
      break;
    case 2:
      option = { value: 3, label: "March" };
      break;
    case 3:
      option = { value: 4, label: "April" };
      break;
    case 4:
      option = { value: 5, label: "May" };
      break;
    case 5:
      option = { value: 6, label: "June" };
      break;
    case 6:
      option = { value: 7, label: "July" };
      break;
    case 7:
      option = { value: 8, label: "August" };
      break;
    case 8:
      option = { value: 9, label: "September" };
      break;
    case 9:
      option = { value: 10, label: "October" };
      break;
    case 10:
      option = { value: 11, label: "November" };
      break;
    case 11:
      option = { value: 12, label: "December" };
      break;
    default:
      option = "";
  }
  return option;
};

let currentYear = new Date().getFullYear();

let initData = {
  workPlace: "",
  month: currentMonthInitData(),
  year: { value: currentYear, label: currentYear },
  status: statusDDL[0],
};

export function ProcessReport({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {};

  const [objProps, setObjprops] = useState({});
  const [workPlaceDDL, setWorkplaceDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);

  useEffect(() => {
    getWorkplaceDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setWorkplaceDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const monthDDL = [
    { value: 0, label: "All" },
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    getYearDDLForProcessReport(setYearDDL);
  }, []);

  return (
    <IForm
      title={"Requisition Process Report"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          selectedBusinessUnit={selectedBusinessUnit}
          workPlaceDDL={workPlaceDDL}
          monthDDL={monthDDL}
          yearDDL={yearDDL}
          statusDDL={statusDDL}
        />
      </div>
    </IForm>
  );
}
