
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getDifferenceBetweenTime,
  getPurposeDDL,
  getWorkplaceDDL_api,
  saveOverTime,
} from "../helper";

let initData = {
  workPlace: "",
  employee: "",
  enroll: "",
  designation: "",
  code: "",
  date: _todayDate(),
  startTime: "",
  endTime: "",
  overTimeHour: "",
  purpose: "",
  remarks: "",
};

export function OverTimeEntry({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    saveOverTime(rowDto, profileData, selectedBusinessUnit, setDisabled);
  };

  const [objProps, setObjprops] = useState({});

  const [rowDto, setRowDto] = useState([]);
  const [workPlaceDDL, setWorkplaceDDL] = useState([]);

  const [purposeDDL, setPurposeDDL] = useState([]);

  const rowDtoAddHandler = (values) => {
    let difference = getDifferenceBetweenTime(
      values?.date,
      values?.startTime,
      values?.endTime
    );

    const data = [...rowDto];

    let foundIndex = null;

    // check isFound
    data.forEach((item, index) => {
      if (
        item?.employee?.value === values?.employee?.value &&
        values?.date === item?.date
      ) {
        foundIndex = index;
      }
    });

    if (foundIndex !== null) {
      data[foundIndex] = {
        ...data[foundIndex],
        startTime: values?.startTime,
        endTime: values?.endTime,
        difference,
        countableHour: difference,
        purpose: {
          value: values?.purpose?.value,
          label: values?.purpose?.label,
        },
        remarks: values?.remarks,
      };
    } else {
      data.push({ ...values, difference, countableHour: difference });
    }
    setRowDto(data);
  };

  const remover = (i) => {
    const data = rowDto?.filter((item, index) => index !== i);
    setRowDto(data);
  };

  useEffect(() => {
    getPurposeDDL(setPurposeDDL);
    getWorkplaceDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setWorkplaceDDL
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <IForm
      title={id ? "Edit Overtime Entry" : "Overtime Entry"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          selectedBusinessUnit={selectedBusinessUnit}
          profileData={profileData}
          rowDtoAddHandler={rowDtoAddHandler}
          rowDto={rowDto}
          setRowDto={setRowDto}
          workPlaceDDL={workPlaceDDL}
          remover={remover}
          purposeDDL={purposeDDL}
          getDifferenceBetweenTime={getDifferenceBetweenTime}
        />
      </div>
    </IForm>
  );
}
