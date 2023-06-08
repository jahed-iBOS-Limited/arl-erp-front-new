/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import moment from "moment";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import { createOrUpdateSalesCalender } from "../helper";

const initData = {
  month: "",
  year: "",
  calendarStatus: "",
};

export default function SalescalendarSetupForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const [yearDDL, setYearDDL] = useState([]);
  const [gridDta, setGridData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // year DDL
  const prevFiveYears = +moment(_todayDate()).format("YYYY") - 5;
  const nextFiveYears = +moment(_todayDate()).format("YYYY") + 5;
  let yearDDLList = [];
  for (let i = prevFiveYears; i <= nextFiveYears; i++) {
    const element = i;
    yearDDLList.push({
      value: i,
      label: `${element}`,
    });
  }
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      setYearDDL(yearDDLList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (values?.itemLists?.length <= 0) {
        toast.warning("Please add atleast one item");
        setDisabled(false);
      } else {
        // Create Sales calender setup
        const modifyData = values?.itemLists?.map((itm) => ({
          salesCalenderRowId: itm?.salesCalenderRowId || 0,
          salesCalenderHeaderId: itm?.salesCalenderHeaderId || 0,
          salesDate: itm?.salesDate,
          dayCount: itm?.dayCount,
          dayName: itm?.dayName,
          satusId: itm?.calendarStatus?.value || "",
          statusName: itm?.calendarStatus?.label || "",
          lastActionDateTime: _todayDate(),
          actionBy: profileData?.userId,
        }));
        const payload = {
          headerDTO: {
            salesCalenderHeaderId: 0,
            monthId: values?.month?.value,
            yearId: values?.year?.value,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            actionBy: profileData?.userId,
            lastActionDateTime: _todayDate(),
          },
          rowDTOs: modifyData,
        };
        createOrUpdateSalesCalender(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title={"Sales Calendar Setup"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setIsLoading={setDisabled}
        yearDDL={yearDDL}
        setGridData={setGridData}
        gridDta={gridDta}
      />
    </IForm>
  );
}
