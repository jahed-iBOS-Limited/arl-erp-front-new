import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getEmployeeDDLAction, getYearDDL, getBscDDLAction } from "../helper";
import Help from "./../../../help/Help";
import { _todayDate } from "../../../../_helper/_todayDate";

let initData = {
  employee: "",
  year: "",
  category: "",
  description: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  task: "",
};

export function IndividualInitiativeForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [individualEmpDDL, setIndividualEmpDDL] = useState([]);
  const [year, setYear] = useState([]);
  const [bscDDL, setBscDDL] = useState([]);
  const [rowDto, setRowDto] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getEmployeeDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setIndividualEmpDDL
    );
    getYearDDL(profileData?.accountId, selectedBusinessUnit?.value, setYear);
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getBscDDLAction(setBscDDL);
  }, []);

  const saveHandler = async (values, cb) => {};

  const [objProps, setObjprops] = useState({});

  const handleDelete = (index) => {
    const newData = [...currentItem?.activityList];
    newData.splice(index, 1);
    setCurrentItem({ ...currentItem, activityList: newData });
    let data = { ...rowDto };
    data.kpiWithActivityList[currentIndex] = {
      ...currentItem,
      activityList: newData,
    };
    setRowDto(data);
  };

  return (
    <IForm
      title={"Action Plan"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
      isHelp={true}
      helpModalComponent={<Help />}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          individualEmpDDL={individualEmpDDL}
          year={year}
          bscDDL={bscDDL}
          saveHandler={saveHandler}
          rowDto={rowDto}
          setRowDto={setRowDto}
          handleDelete={handleDelete}
          setDisabled={setDisabled}
          isDisabled={isDisabled}
          setCurrentItem={setCurrentItem}
          currentItem={currentItem}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </IForm>
  );
}
