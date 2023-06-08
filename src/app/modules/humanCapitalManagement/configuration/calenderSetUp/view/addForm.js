/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getSingleData,
  saveCalenderSetUp,
  saveEditedCalenderSetup,
  saveEditedTransferOut,
  saveTrasnferOut,
  getSingleDataById,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICustomCard from "../../../../_helper/_customCard";
import { countTotalDays } from "./../Create/form";

const initData = {
  calenderName: "",
  startTime: "9:00 AM",
  endTime: "",
  minworkHour: "",
  allowedStartTime: "9:15 AM",
  latestStartTime: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  description: "",
  numOfWeekDDL: "",
  dayOfWeekDDL: "",
  remarks: "",
  saturday: false,
  sunday: false,
  monday: false,
  tuesday: false,
  wednessday: false,
  thursday: false,
  friday: false,
};

export default function CreateCalenderViewForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();
  const [customData, setCustomData] = useState([]);
  const [total, setTotal] = useState({ totalAmount: 0 });
  // const [checkPublic, setCheckPublic] = useState(false);
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  // console.log(checkPublic, "checkPublic")

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (id) {
      getSingleDataById(id, setSingleData, setRowDto);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const newData = singleData?.holyday?.map((item, index) => ({
        ...item,
        fromDate: _dateFormatter(item?.fromDate),
        toDate: _dateFormatter(item?.toDate),
        description: item?.remarks,
        totalDays: countTotalDays(
          _dateFormatter(item?.fromDate),
          _dateFormatter(item?.toDate)
        ),
      }));

      setRowDto(newData);
    } else {
      setRowDto([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const setter = (values) => {
    setRowDto([...rowDto, values]);
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;

    let totalQR = 1;

    if (rowDto?.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalQR =
          +rowDto[i]?.quantity * (+rowDto[i]?.basePrice || +rowDto[i]?.rate);

        totalAmount += totalQR;
      }
    }

    setTotal({ totalAmount });
  }, [rowDto]);

  return (
    <ICustomCard
      title={"View Calendar Setup"}
      backHandler={() => {
        history.goBack();
      }}
      renderProps={() => {}}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        disableHandler={disableHandler}
        remover={remover}
        rowDto={rowDto}
        setter={setter}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        sbu={location?.state?.selectedSbu}
        customData={customData}
        setCustomData={setCustomData}
        total={total}
        itemSelectHandler={itemSelectHandler}
        isEdit={params?.id || false}
        setRowDto={setRowDto}
      />
    </ICustomCard>
  );
}
