/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import {
  saveCalenderSetUp,
  getSingleDataById,
  saveEditedCalenderSetup,
  GetHolidaySetupDDL
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";
import { countTotalDays } from "./form";

const initData = {
  calenderName: "",
  startTime: "",
  endTime: "",
  minworkHour: "",
  allowedStartTime: "",
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

export default function CreateCalenderForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();
  const [customData, setCustomData] = useState([]);
  const [total, setTotal] = useState({ totalAmount: 0 });
  const [holidayGroupNameDDL, setHolidayGroupName] = useState([]);

  console.log(rowDto, "rowDto")

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect (()=> {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      GetHolidaySetupDDL(profileData?.accountId, setHolidayGroupName)
    }
    
  },[profileData, selectedBusinessUnit]);

  console.log(holidayGroupNameDDL, "holidayGroupNameDDL")

  useEffect(() => {
    if (params?.id) {
      getSingleDataById(params?.id, setSingleData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      const newData = singleData?.holyday?.map((item) => ({
        ...item,
        fromDate: item?.fromDate,
        toDate: item?.toDate,
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

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id) {
        let objRow = rowDto?.map((item) => ({
          holidayId: item?.holidayId || 0,
          fromDate: item?.fromDate,
          toDate: item?.toDate,
          totalDays: 0,
          remarks: item?.description,
        }));
        const payload = {
          calender: {
            calenderId: +params?.id,
            calenderCode: "string",
            calenderName: values?.calenderName,
            startTime: values?.startTime,
            extendedStartTime: values?.allowedStartTime,
            lastStartTime: values?.latestStartTime,
            endTime: values?.endTime,
            minWorkHour: values?.minworkHour,
            isSaturday: values?.saturday,
            isSunday: values?.sunday,
            isMonday: values?.monday,
            isTuesday: values?.tuesday,
            isWednesday: values?.wednessday,
            isThursday: values?.thursday,
            isFriday: values?.friday,
          },
          holyday: rowDto?.length > 0 ? objRow : [],
          offday:
            !values?.numOfWeekDDL?.value || !values?.dayOfWeekDDL?.value
              ? null
              : {
                  exceptionId: values?.exceptionId || 0,
                  exceptionName: values?.remarks || 0,
                  serialName: values?.numOfWeekDDL?.label,
                  serialNo: values?.numOfWeekDDL?.value,
                  weekdayId: values?.numOfWeekDDL?.value,
                  weekdayName: values?.dayOfWeekDDL?.label,
                  weekdayNoId: values?.numOfWeekDDL?.value,
                  weekdayNo: values?.numOfWeekDDL?.label,
                },
        };
        saveEditedCalenderSetup(payload, setDisabled);
      } else {
        let objRow = rowDto?.map((item) => ({
          fromDate: _dateFormatter(item?.fromDate),
          toDate: _dateFormatter(item?.toDate),
          totalDays: 0,
          remarks: item?.description,
        }));
        const payload = {
          calender: {
            calenderCode: "string",
            calenderName: values?.calenderName,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            startTime: values?.startTime,
            extendedStartTime: values?.allowedStartTime,
            lastStartTime: values?.latestStartTime,
            endTime: values?.endTime,
            minWorkHour: values?.minworkHour,
            isSaturday: values?.saturday,
            isSunday: values?.sunday,
            isMonday: values?.monday,
            isTuesday: values?.tuesday,
            isWednesday: values?.wednessday,
            isThursday: values?.thursday,
            isFriday: values?.friday,
          },
          holyday: objRow,
          offday: {
            exceptionName: values?.remarks,
            serialName: values?.numOfWeekDDL?.label,
            serialNo: values?.numOfWeekDDL?.value,
            weekdayId: values?.numOfWeekDDL?.value,
            weekdayName: values?.dayOfWeekDDL?.label,
            weekdayNoId: values?.numOfWeekDDL?.value,
            weekdayNo: values?.numOfWeekDDL?.label,
          },
        };

        !values?.remarks && delete payload?.offday;
        saveCalenderSetUp(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (payload) => {
    if (isUniq("fromDate", payload.fromDate, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };

  // const remover = (payload) => {
  //   const filterArr = rowDto.filter(
  //     (itm) => itm?.fromDate !== payload
  //   );
  //   setRowDto(filterArr);
  // };

  // const setter = (values) => {
  //   setRowDto([...rowDto, values]);
  // };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  return (
    <IForm
      title={params?.id ? "Edit Calendar Setup" : "Create Calendar Setup"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        remover={remover}
        rowDto={rowDto}
        setter={setter}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        sbu={location?.state?.selectedSbu}
        customData={customData}
        setCustomData={setCustomData}
        itemSelectHandler={itemSelectHandler}
        isEdit={params?.id || false}
        id={params?.id}
        setRowDto={setRowDto}
        holidayGroupNameDDL={holidayGroupNameDDL}
      />
    </IForm>
  );
}
