/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { damageCalenderSave, getDamageCalender } from "./../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  year: "",
  startDate: "",
  endDate: "",
};

const RTMCalendarSetup = ({ match: { params } }) => {
  const [isDisabled, setDisabled] = useState(false);
  const [calendarConfig, setCalendarConfig] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // start date condition
      // const startDateData = calendarConfig?.every(
      //   (item) =>
      //     Date.parse(item?.startDate) > Date.parse(values?.year?.prevDate) &&
      //     Date.parse(item?.startDate) < Date.parse(values?.year?.nextDate)
      // );

      // end date condition
      // const endDateData = calendarConfig?.every(
      //   (item) =>
      //     Date.parse(item?.endDate) > Date.parse(values?.year?.prevDate) &&
      //     Date.parse(item?.endDate) < Date.parse(values?.year?.nextDate)
      // );
      // if (startDateData === false && endDateData === false) {
      //   toast.warning("Invalid Date Range");
      // } else {
        const modifyData = calendarConfig?.map((itm) => ({
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          monthId: itm?.monthID,
          monthName: itm?.monthName,
          monthStartDate: itm?.startDate,
          monthEndDate: itm?.endDate,
        }));
        const payload = {
          yearId: values?.year?.value,
          damageCalenders: modifyData,
        };
        const callbackFunc = () => {
          getDamageCalender(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            values?.year?.value,
            setCalendarConfig,
            setDisabled
          );
          cb();
        };
        damageCalenderSave(payload, setDisabled, callbackFunc);
      // }
    }
  };

  // Select Individual Item
  const selectIndividualItem = (sl, value, name) => {
    let newRowdata = [...calendarConfig];
    newRowdata[sl][name] = value;
    setCalendarConfig(newRowdata);
  };

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        title={"Month Setup"}
        initData={initData}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        saveHandler={saveHandler}
        calendarConfig={calendarConfig}
        setCalendarConfig={setCalendarConfig}
        setIsLoading={setDisabled}
        selectIndividualItem={selectIndividualItem}
      />
    </>
  );
};

export default RTMCalendarSetup;
