import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { currentMonthInitData } from "../../../../_helper/_currentMonth";
import { getPositionGroupDDL, getWorkplaceGroupDDLAction } from "../helper";
import { YearDDL } from "../../../../_helper/_yearDDL";

const date = new Date();
const year = date.getFullYear();

let initData = {
  month: currentMonthInitData(date),
  year: { value: year, label: year },
  workplaceGroup: "",
  positionGroup: "",
};

export const monthDDL = [
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

const yearList = YearDDL();

export function DetailsTable({
  history,
  match: {
    params: { id },
  },
}) {

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [workPlaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [positionGroupDDL, setPositionGroupDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getWorkplaceGroupDDLAction(profileData?.accountId, setWorkplaceGroupDDL);
    getPositionGroupDDL(profileData?.accountId, setPositionGroupDDL);
  }, [profileData]);

  const saveHandler = async (values, cb) => {};

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Salary Generate"}
      getProps={setObjprops}
      isHiddenBack={true}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          workPlaceGroupDDL={workPlaceGroupDDL}
          positionGroupDDL={positionGroupDDL}
          yearList={yearList}
          gridData={gridData}
          setGridData={setGridData}
          isLoading={isLoading}
          setLoading={setLoading}
          selectedBusinessUnit={selectedBusinessUnit}
        />
      </div>
    </IForm>
  );
}
