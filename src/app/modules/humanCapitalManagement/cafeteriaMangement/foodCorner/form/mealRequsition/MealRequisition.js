/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../../_helper/_form";
import { postCafeteriaEntry } from "../../helper/action";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Loading from "../../../../../_helper/_loading";
import { toast } from "react-toastify";

const initData = {
  ToDate: _todayDate(),
  selectType: "private",
  empName: "",
  MealFor: "1",
  CountMeal: 1,
  TypeId: "",
  Narration: "",
  consumePlace:""
};

export default function MealRequisition({ setRowData, setConsumeData, setEmpId }) {
  const [isDisabled, setDisabled] = useState(false);

  const {profileData, userRole} = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const foodCornerPermission = userRole.filter(
    (item) => item?.strFeatureName === "Food Corner(Public)"
  );

  const saveHandler = async (values, cb) => {
    if(values?.selectType === "public" && !values?.empName) return toast.warn("Employee is required")
    let isOwnGuest;
    let isPayable;
    if (values) {
      if (values.MealFor === "2") {
        isOwnGuest = 1;
        isPayable = 0;
      } else if (values.MealFor === "1") {
        isOwnGuest = 0;
        isPayable = 1;
      }
      postCafeteriaEntry(
        1,
        values?.ToDate,
        values?.selectType === "public"
          ? values?.empName?.value
          : profileData.employeeId,
        values?.TypeId?.value,
        values?.selectType === "public" ? 1 : 0,
        values.MealFor,
        values.CountMeal,
        isOwnGuest,
        isPayable,
        values.Narration,
        profileData?.userId,
        values?.consumePlace?.value,
        setRowData,
        setDisabled,
        cb
      );
    } else {
      setDisabled(false);
    }
  };

  // useEffect(() => {
  //   fetchEmpDDL(profileData.accountId, selectedBusinessUnit.value, setEmpDDL);
  // }, []);

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Meal Requisition"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}

      <div className="py-4 global-form">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          // empDDL={empDDL}
          profileData={profileData}
          setRowData={setRowData}
          setConsumeData={setConsumeData}
          foodCornerPermission={foodCornerPermission}
          setEmpId={setEmpId}
        />
      </div>
    </IForm>
  );
}
